import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { SearchData } from '../core';

export function useExplorerQuery<Q>(
	query: UseInfiniteQueryResult<InfiniteData<SearchData<Q>>> & { 
		virtualizedHelpers?: { 
			getVisibleRange: (scrollTop: number) => { 
				startIndex: number;
				endIndex: number;
				startPage: number;
				endPage: number;
			};
			prefetchPages: (startPage: number, endPage: number) => Promise<void>;
			totalHeight: number;
		}
	},
	count: UseQueryResult<number>
) {
	const items = useMemo(
		() => query.data?.pages.flatMap((data) => data.items) ?? null,
		[query.data]
	);

	const loadMore = useCallback(() => {
		if (query.hasNextPage && !query.isFetchingNextPage) {
			query.fetchNextPage.call(undefined);
		}
	}, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

	return { 
		query, 
		items, 
		loadMore, 
		count: count.data,
		virtualizedHelpers: query.virtualizedHelpers 
	};
}

export type UseExplorerQuery<Q> = ReturnType<typeof useExplorerQuery<Q>>;
