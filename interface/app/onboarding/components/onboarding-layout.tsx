import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { OnboardingPage, unlockOnboardingScreen, useOnboardingStore } from '@sd/client';
import { tw } from '@sd/ui';
import { useOperatingSystem } from '~/hooks';
import { usePlatform } from '~/util/Platform';

import { OnboardingLeftSection } from './left-section';
import { type PrivacyDisclosureInfo } from './privacy-disclosure';

export const ACTION_BAR_PORTAL_ID = 'action-bar-portal';

type OnboardingLayoutProps = {
	children: ReactNode;
	customBackground?: string;
	actions?: ReactNode;
} & (
	| {
			leftSection?: undefined;
			title: string;
			description: string;
			privacy: PrivacyDisclosureInfo;
	  }
	| {
			leftSection: ReactNode;
			title?: undefined;
			description?: undefined;
			privacy?: undefined;
	  }
);

export function OnboardingLayout(props: OnboardingLayoutProps) {
	const { children, leftSection, title, description, privacy, customBackground, actions } = props;
	const operatingSystem = useOperatingSystem();
	const obStore = useOnboardingStore();
	const navigate = useNavigate();
	const match = useMatch('/onboarding/:screen');
	const currentScreen = match?.params?.screen as OnboardingPage | undefined;
	const platform = usePlatform();

	// set a fixed window size and disable resizing when onboarding starts (so our layout always looks good)
	// a better solution would be to use a wholly separate window for onboarding, but that's for wayyy later
	useEffect(() => {
		const setupWindow = async () => {
			try {
				// THIS IS NOT WORKING WHYYYYYY
				// ~ilynxcat 2024/nov/14
				await platform.setFixedWindowSize?.(1100, 768);
				await platform.setWindowResizable?.(false);
			} catch (error) {
				console.error('Failed to configure window', error);
			}
		};

		setupWindow();

		// restore window resizability when onboarding unmounts
		return () => {
			platform
				.unsetFixedWindowSize?.()
				.catch((error) => console.error('Failed to restore window', error));
		};
	}, [platform]);

	useEffect(() => {
		if (!currentScreen) return;
		unlockOnboardingScreen(currentScreen);
	}, [currentScreen]);

	// Define the routes based on OS
	const routes: OnboardingPage[] =
		operatingSystem === 'macOS'
			? [
					'prerelease',
					'new-library',
					'full-disk',
					'locations',
					'telemetry',
					'creating-library'
				]
			: ['prerelease', 'new-library', 'locations', 'telemetry', 'creating-library'];

	return (
		<Container
			className={clsx({
				'rounded-[10px] [&_.titlebar]:rounded-t-[10px]': operatingSystem === 'macOS'
			})}
			style={{
				background: customBackground ? customBackground : 'none'
			}}
		>
			<div className="grid size-full grid-cols-[28rem_1fr]">
				{leftSection ? (
					leftSection
				) : (
					<OnboardingLeftSection
						title={title!}
						description={description!}
						privacyInfo={privacy!}
					/>
				)}
				<main className={clsx({ 'bg-[#111116]/80': !customBackground })}>{children}</main>
			</div>
			<div className="absolute bottom-5 left-7 z-50 h-8 w-[24.5rem]">
				<div className="flex size-full flex-row items-center justify-between">
					<div className="flex flex-row items-center justify-center space-x-2 rounded-full bg-black/20 px-3.5 py-2.5">
						{routes.map((path) => (
							<Link
								key={path}
								to={`/onboarding/${path}`}
								onClick={(e) => {
									if (!obStore.unlockedScreens.includes(path)) {
										e.preventDefault();
									}
								}}
								className={clsx(
									'size-2 cursor-default rounded-full transition',
									currentScreen === path
										? 'bg-ink'
										: obStore.unlockedScreens.includes(path)
											? 'bg-ink-faint hover:bg-ink'
											: 'bg-ink-faint/10'
								)}
							/>
						))}
					</div>
					<div id={ACTION_BAR_PORTAL_ID} className="flex items-center gap-2">
						{actions}
					</div>
				</div>
			</div>
		</Container>
	);
}

const Container = tw.div`
	absolute top-0 left-0 w-screen h-screen
	text-ink font-plex
	border border-app-frame
	overflow-hidden
`;
