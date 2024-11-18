import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { OnboardingPage } from '@sd/client';

interface OnboardingProgressIndicatorProps {
	routes: string[];
	currentScreen: OnboardingPage | undefined;
	unlockedScreens: string[];
}

export function OnboardingProgressIndicator({
	routes,
	currentScreen,
	unlockedScreens
}: OnboardingProgressIndicatorProps) {
	return (
		<div className="flex flex-row items-center justify-center rounded-full bg-black/20 px-2.5 py-1.5">
			{routes.map((path) => (
				<Link
					key={path}
					to={`/onboarding/${path}`}
					onClick={(e) => {
						if (!unlockedScreens.includes(path)) {
							e.preventDefault();
						}
					}}
					className="group flex cursor-default items-center p-1 transition"
				>
					<div
						className={clsx('size-2 rounded-full transition', {
							'bg-ink-faint group-hover:bg-ink': unlockedScreens.includes(path),
							'bg-ink-faint/10':
								path !== currentScreen && !unlockedScreens.includes(path),
							'!bg-ink': path === currentScreen
						})}
					/>
				</Link>
			))}
		</div>
	);
}
