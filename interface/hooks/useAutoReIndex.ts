import { Location, useLibraryMutation } from '@sd/client';
import { toast } from '@sd/ui';
import { useLocale } from '~/hooks';

function useAutoReIndex(location: Location, path: string) {
	const { t } = useLocale();
	const fullRescan = useLibraryMutation('locations.fullRescan', {
		onSuccess: () => {
			toast.info({
				title: t('reindexing_started'),
				body: t('reindexing_location', { location_name: location.name })
			});
		}
	});
	const scanLocationSubPath = useLibraryMutation('locations.subPathRescan', {
		onSuccess: () => {
			toast.info({
				title: t('reindexing_started'),
				body: t('reindexing_location_subpath', {
					location_name: location.name,
					path,
					interpolation: { escapeValue: false }
				})
			});
		}
	});

	return {
		reIndex: () => {
			if (path) {
				scanLocationSubPath.mutate({
					location_id: location.id,
					sub_path: path
				});
			} else {
				fullRescan.mutate({
					location_id: location.id,
					reidentify_objects: false
				});
			}
		}
	};
}

export default useAutoReIndex;
