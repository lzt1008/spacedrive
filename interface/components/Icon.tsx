import {
	Desktop,
	DownloadSimple,
	File,
	Image,
	MusicNote,
	Icon as PhosphorIcon,
	Video
} from '@phosphor-icons/react';
import { getIcon, iconNames } from '@sd/assets/util';
import clsx from 'clsx';
import { ImgHTMLAttributes } from 'react';
import { SystemLocations } from '@sd/client';
import { useIsDark } from '~/hooks';

export type IconName = keyof typeof iconNames;

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
	name: IconName;
	size?: number;
	theme?: 'dark' | 'light';
}

export const Icon = ({ name, size, theme, ...props }: Props) => {
	const isDark = useIsDark();
	return (
		<img
			src={getIcon(name, theme ? theme === 'dark' : isDark)}
			width={size}
			height={size}
			{...props}
			className={clsx('pointer-events-none', props.className)}
		/>
	);
};

export const IconWithOverlay = ({ size = 20, icon }: { size: number; icon: PhosphorIcon }) => {
	const isDark = useIsDark();
	const OverlayIcon = icon;
	return (
		<div className="absolute -bottom-9 -right-9 size-28">
			<Icon name="Folder" size={size} />
			<OverlayIcon
				weight="fill"
				size={size / 2}
				className={clsx(
					'absolute left-1/2 top-[42%] -translate-x-1/2 fill-black transition-opacity',
					isDark
						? 'opacity-30 group-focus-within:opacity-60 group-hover:opacity-60'
						: 'opacity-25 group-focus-within:opacity-50 group-hover:opacity-50'
					// props.active && (isDark ? 'opacity-60' : 'opacity-50')
				)}
			/>
		</div>
	);
};

type SystemLocation = keyof SystemLocations;

// const homeFolderIcons: Record<SystemLocation, PhosphorIcon> = {
// 	desktop: Desktop,
// 	documents: File,
// 	downloads: DownloadSimple,
// 	pictures: Image,
// 	music: MusicNote,
// 	videos: Video
// };

// export const HomeFolderIcon = ({ path }: { path: string }) => {
// 	return (
// 		<IconWithOverlay
// 			icon={homeFolderIcons[path]}
// 			size={28}
// 			className="relative right-[-26px] z-0 brightness-[0.5]"
// 			/>
// 	)
// };
