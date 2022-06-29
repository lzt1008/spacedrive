use crate::{
	job::{Job, JobReportUpdate, WorkerContext},
	node::get_nodestate,
	prisma::file_path,
	sys, CoreContext, CoreEvent,
};
use futures::executor::block_on;
use image::{self, imageops, DynamicImage, GenericImageView};
use log::{error, info};
use std::error::Error;
use std::path::{Path, PathBuf};
use tokio::fs;
use webp::Encoder;

#[derive(Debug, Clone)]
pub struct ThumbnailJob {
	pub location_id: i32,
	pub path: PathBuf,
	pub background: bool,
}

static THUMBNAIL_SIZE_FACTOR: f32 = 0.2;
static THUMBNAIL_QUALITY: f32 = 30.0;
pub static THUMBNAIL_CACHE_DIR_NAME: &str = "thumbnails";

#[async_trait::async_trait]
impl Job for ThumbnailJob {
	fn name(&self) -> &'static str {
		"thumbnailer"
	}

	async fn run(&self, ctx: WorkerContext) -> Result<(), Box<dyn Error>> {
		let config = get_nodestate();

		let location = sys::get_location(&ctx.core_ctx, self.location_id).await?;

		info!(
			"Searching for images in location {} at path {:#?}",
			location.id, self.path
		);

		// create all necessary directories if they don't exist
		fs::create_dir_all(
			config
				.data_path
				.as_ref()
				.unwrap()
				.join(THUMBNAIL_CACHE_DIR_NAME)
				.join(format!("{}", self.location_id)),
		)
		.await?;
		let root_path = location.path.unwrap();

		// query database for all files in this location that need thumbnails
		let image_files = get_images(&ctx.core_ctx, self.location_id, &self.path).await?;
		info!("Found {:?} files", image_files.len());

		let is_background = self.background;

		tokio::task::spawn_blocking(move || {
			ctx.progress(vec![
				JobReportUpdate::TaskCount(image_files.len()),
				JobReportUpdate::Message(format!(
					"Preparing to process {} files",
					image_files.len()
				)),
			]);

			for (i, image_file) in image_files.iter().enumerate() {
				ctx.progress(vec![JobReportUpdate::Message(format!(
					"Processing {}",
					image_file.materialized_path.clone()
				))]);

				// assemble the file path
				let path = Path::new(&root_path).join(&image_file.materialized_path);
				error!("image_file {:?}", image_file);

				// get cas_id, if none found skip
				let cas_id = match image_file.file() {
					Ok(file) => {
						if let Some(f) = file {
							f.cas_id.clone()
						} else {
							continue;
						}
					}
					Err(_) => {
						error!("Error getting cas_id {:?}", image_file.materialized_path);
						continue;
					}
				};

				// Define and write the WebP-encoded file to a given path
				let output_path = config
					.data_path
					.as_ref()
					.unwrap()
					.join(THUMBNAIL_CACHE_DIR_NAME)
					.join(format!("{}", location.id))
					.join(&cas_id)
					.with_extension("webp");

				// check if file exists at output path
				if !output_path.exists() {
					info!("Writing {:?} to {:?}", path, output_path);
					block_on(generate_thumbnail(&path, &output_path))
						.map_err(|e| {
							info!("Error generating thumb {:?}", e);
						})
						.unwrap_or(());

					ctx.progress(vec![JobReportUpdate::CompletedTaskCount(i + 1)]);

					if !is_background {
						block_on(ctx.core_ctx.emit(CoreEvent::NewThumbnail { cas_id }));
					};
				} else {
					info!("Thumb exists, skipping... {}", output_path.display());
				}
			}
		})
		.await?;

		Ok(())
	}
}

pub async fn generate_thumbnail<P: AsRef<Path>>(
	file_path: P,
	output_path: P,
) -> Result<(), Box<dyn Error>> {
	// Using `image` crate, open the included .jpg file
	let img = image::open(file_path)?;
	let (w, h) = img.dimensions();
	// Optionally, resize the existing photo and convert back into DynamicImage
	let img = DynamicImage::ImageRgba8(imageops::resize(
		&img,
		(w as f32 * THUMBNAIL_SIZE_FACTOR) as u32,
		(h as f32 * THUMBNAIL_SIZE_FACTOR) as u32,
		imageops::FilterType::Triangle,
	));
	// Create the WebP encoder for the above image
	let encoder = Encoder::from_image(&img)?;

	// Encode the image at a specified quality 0-100
	let webp = encoder.encode(THUMBNAIL_QUALITY);

	fs::write(output_path, &*webp).await?;

	Ok(())
}

pub async fn get_images(
	ctx: &CoreContext,
	location_id: i32,
	path: impl AsRef<Path>,
) -> Result<Vec<file_path::Data>, std::io::Error> {
	let mut params = vec![
		file_path::location_id::equals(Some(location_id)),
		file_path::extension::in_vec(vec![
			"png".to_string(),
			"jpeg".to_string(),
			"jpg".to_string(),
			"gif".to_string(),
			"webp".to_string(),
		]),
	];

	let path_str = path.as_ref().to_string_lossy().to_string();

	if !path_str.is_empty() {
		params.push(file_path::materialized_path::starts_with(path_str))
	}

	let image_files = ctx
		.database
		.file_path()
		.find_many(params)
		.with(file_path::file::fetch())
		.exec()
		.await
		.unwrap();

	Ok(image_files)
}
