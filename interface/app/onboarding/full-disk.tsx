import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@sd/ui';
import { Icon } from '~/components';
import { useLocale } from '~/hooks';
import { usePlatform } from '~/util/Platform';

import { OnboardingLayout } from './components';

export const FullDisk = () => {
	const [fdaVideo, setFdaVideo] = useState<string | null>(null);
	const { requestFdaMacos } = usePlatform();
	const navigate = useNavigate();

	const { t } = useLocale();

	useEffect(() => {
		import('@sd/assets/videos/Fda.mp4').then(
			(module) => {
				setFdaVideo(module.default);
			},
			(err) => {
				console.error(err);
				navigate('../locations', { replace: true });
			}
		);
	});

	return (
		<OnboardingLayout
			title="Allow full disk access"
			description="To enable file browsing and management, Spacedrive needs the Full Disk Access permission."
			privacy={{
				description:
					"Spacedrive doesn't access files or folders that you haven't manually added or browsed to, other than its own configuration and metadata files.",
				href: 'https://spacedrive.com/docs/company/legal/privacy',
				hrefLabel: 'Privacy details'
			}}
			actions={
				<>
					<Button
						variant="default"
						size="onboardingFixed"
						onClick={() => navigate('../locations', { replace: true })}
					>
						{t('maybe_later')}
					</Button>
					<Button variant="accent" size="onboardingFixed" onClick={requestFdaMacos}>
						Continue
					</Button>
				</>
			}
		>
			<div className="flex flex-col items-center">
				<div className="mt-5 w-full max-w-[450px]">
					{fdaVideo && (
						<video
							className="rounded-md"
							autoPlay
							loop
							muted
							controls={false}
							src={fdaVideo}
						/>
					)}
				</div>
			</div>
		</OnboardingLayout>
	);
};
