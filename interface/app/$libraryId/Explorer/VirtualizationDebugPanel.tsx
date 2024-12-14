import { useEffect, useState } from 'react';

import { useExplorerContext } from './Context';

interface VirtualizationMetrics {
	totalFiles: number;
	totalPages: number;
	loadedPages: number;
	currentPage: number;
	scrollOffset: number;
	visibleRange?: {
		startIndex: number;
		endIndex: number;
		startPage: number;
		endPage: number;
	};
}

export const VirtualizationDebugPanel = () => {
	const explorer = useExplorerContext() as UseExplorer;
	const [metrics, setMetrics] = useState<VirtualizationMetrics>({
		totalFiles: 0,
		totalPages: 0,
		loadedPages: 0,
		currentPage: 0,
		scrollOffset: 0
	});

	useEffect(() => {
		const updateMetrics = () => {
			const scrollTop = explorer.scrollRef.current?.scrollTop ?? 0;
			const visibleRange = explorer.virtualizedHelpers?.getVisibleRange(scrollTop);

			setMetrics({
				totalFiles: explorer.count ?? 0,
				totalPages: Math.ceil((explorer.count ?? 0) / 100),
				loadedPages: explorer.items?.length ?? 0,
				currentPage: Math.floor(scrollTop / (100 * 37)), // 37 is row height
				scrollOffset: scrollTop,
				visibleRange
			});
		};

		const scrollElement = explorer.scrollRef.current;
		if (scrollElement) {
			scrollElement.addEventListener('scroll', updateMetrics);
			updateMetrics(); // Initial update
		}

		return () => {
			scrollElement?.removeEventListener('scroll', updateMetrics);
		};
	}, [explorer]);

	if (!explorer.virtualizedHelpers) return null;

	return (
		<div className="fixed bottom-4 right-4 z-50 rounded-lg bg-app-box/90 p-3 text-sm shadow-lg backdrop-blur">
			<div className="font-medium text-ink">Virtualization Debug</div>
			<div className="mt-1 space-y-1 text-ink-faint">
				<div>Total Files: {metrics.totalFiles}</div>
				<div>Total Pages: {metrics.totalPages}</div>
				<div>Loaded Items: {metrics.loadedPages}</div>
				<div>Current Page: {metrics.currentPage}</div>
				<div>Scroll Offset: {metrics.scrollOffset}px</div>
				{metrics.visibleRange && (
					<>
						<div>
							Visible Range: {metrics.visibleRange.startIndex} - {metrics.visibleRange.endIndex}
						</div>
						<div>
							Page Range: {metrics.visibleRange.startPage} - {metrics.visibleRange.endPage}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
