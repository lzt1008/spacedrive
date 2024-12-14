import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { FilePathOrder, FilePathSearchArgs } from '../core';
import { useLibraryContext } from '../hooks';
import { useRspcLibraryContext } from '../rspc';
import { UseExplorerInfiniteQueryArgs } from './useExplorerInfiniteQuery';

interface VirtualizedQueryOptions {
	itemHeight: number; // Height of each item in pixels
	viewportHeight: number; // Height of the viewport in pixels
	overscan?: number; // Number of items to load above and below viewport
	totalItems: number; // Total number of items available
}

export function useVirtualizedExplorerQuery({
	arg,
	order,
	itemHeight,
	viewportHeight,
	overscan = 5,
	totalItems
}: UseExplorerInfiniteQueryArgs<FilePathSearchArgs, FilePathOrder> & VirtualizedQueryOptions) {
	const take = arg.take ?? 100;
	const { library } = useLibraryContext();
	const ctx = useRspcLibraryContext();
	const queryClient = useQueryClient();

	// Calculate visible range based on scroll position
	const getVisibleRange = useCallback(
		(scrollTop: number) => {
			const startIndex = Math.floor(scrollTop / itemHeight);
			const visibleCount = Math.ceil(viewportHeight / itemHeight);
			const endIndex = Math.min(startIndex + visibleCount + overscan, totalItems);

			return {
				startIndex: Math.max(0, startIndex - overscan),
				endIndex,
				startPage: Math.floor(startIndex / take),
				endPage: Math.ceil(endIndex / take)
			};
		},
		[itemHeight, viewportHeight, overscan, take, totalItems]
	);

	// Pre-fetch nearby pages
	const prefetchPages = useCallback(
		async (startPage: number, endPage: number) => {
			const pagesToFetch = Array.from(
				{ length: endPage - startPage + 1 },
				(_, i) => startPage + i
			);

			await Promise.all(
				pagesToFetch.map(async (page) => {
					const queryKey = [
						'search.paths',
						{
							library_id: library.uuid,
							arg: { ...arg, take }
						}
					];

					// Only prefetch if not already in cache
					if (!queryClient.getQueryData(queryKey)) {
						await queryClient.prefetchQuery({
							queryKey,
							queryFn: () => fetchPage(page)
						});
					}
				})
			);
		},
		[library.uuid, arg, take, queryClient]
	);

	// Fetch a specific page
	const fetchPage = useCallback(
		async (page: number) => {
			const orderAndPagination = {
				offset: {
					order,
					offset: page * take
				}
			};

			const result = await ctx.client.query(['search.paths', { ...arg, orderAndPagination }]);

			return { ...result, offset: page, arg };
		},
		[ctx.client, arg, order, take]
	);

	const query = useInfiniteQuery({
		queryKey: [
			'search.paths',
			{
				library_id: library.uuid,
				arg: { ...arg, take }
			}
		],
		queryFn: async ({ pageParam }) => {
			return fetchPage(pageParam);
		},
		initialPageParam: 0,
		getNextPageParam: ({ items, offset }) => {
			if (items.length >= take && (offset + 1) * take < totalItems) {
				return offset + 1;
			}
			return undefined;
		},
		getPreviousPageParam: ({ offset }) => {
			if (offset > 0) return offset - 1;
			return undefined;
		}
	});

	// Expose methods for the virtualized list component
	const virtualizedHelpers = useMemo(
		() => ({
			getVisibleRange,
			prefetchPages,
			totalHeight: totalItems * itemHeight
		}),
		[getVisibleRange, prefetchPages, totalItems, itemHeight]
	);

	return {
		...query,
		virtualizedHelpers
	};
}
