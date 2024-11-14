import { BloomOne } from '@sd/assets/images';
import clsx from 'clsx';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useDebugState } from '@sd/client';
import DragRegion from '~/components/DragRegion';
import { useOperatingSystem } from '~/hooks/useOperatingSystem';
import { usePlatform } from '~/util/Platform';

import { OnboardingContext, useContextValue } from './context';

export const Component = () => {
	const os = useOperatingSystem(false);
	const debugState = useDebugState();
	const ctx = useContextValue();
	// const platform = usePlatform();

	// useEffect(() => {
	// 	// onboarding-size
	// 	if (platform.platform === 'tauri') platform.setFixedWindowSize?.(1100, 768);

	// 	// reset to normal constraints when onboarding is unmounted
	// 	return () => {
	// 		if (platform.platform === 'tauri') platform.unsetFixedWindowSize?.();
	// 	};
	// }, [platform]);

	return (
		<OnboardingContext.Provider value={ctx}>
			<div
				className={clsx(
					'absolute inset-0',
					os === 'macOS' ? 'bg-sidebar/65' : 'bg-sidebar'
				)}
			>
				<DragRegion className="absolute left-0 top-0 z-50 h-9" />
				<Outlet />
			</div>
		</OnboardingContext.Provider>
	);
};
