import { FilePathOrder, FilePathSearchArgs } from '../core';
import { useLibraryQuery } from '../rspc';
import { useExplorerQuery } from './useExplorerQuery';
import { useVirtualizedExplorerQuery } from './useVirtualizedExplorerQuery';

export function usePathsExplorerQuery(props: {
	arg: FilePathSearchArgs;
	order: FilePathOrder | null;
	enabled?: boolean;
	suspense?: boolean;
}) {
	const count = useLibraryQuery(['search.pathsCount', { filters: props.arg.filters }], {
		enabled: props.enabled
	});

	const query = useVirtualizedExplorerQuery({
		...props,
		itemHeight: 37, // Default row height for list view
		viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
		overscan: 5,
		totalItems: count.data ?? 0
	});

	return useExplorerQuery(query, count);
}
