import { NoiseTexture } from '@sd/assets/images';
import { Button, ButtonLink } from '@sd/ui';
import { useIsDark, useLocale } from '~/hooks';
import { usePlatform } from '~/util/Platform';

import { OnboardingLayout } from './components';
import BetaNotice from './components/beta-notice';
import { OnboardingCustomLeftSection } from './components/left-section';

export default function OnboardingPreRelease() {
	const { t } = useLocale();

	return (
		<OnboardingLayout
			customBackground="radial-gradient(95.31% 122.51% at 50% 99.93%, #FF8AF3 0%, rgba(236, 0, 255, 0.00) 100%), linear-gradient(40deg, #4203FF 32.36%, #4E07F9 43.19%, #B521D1 67.63%, #FF429F 80.78%), #111116"
			leftSection={
				<OnboardingCustomLeftSection
					className="noise noise-strong bg-gradient-to-b from-[#16161D]/45 to-[#111116]/70"
					style={{ backgroundBlendMode: 'overlay' }}
					top={
						<hgroup className="flex flex-col gap-3 px-3.5">
							<h1 className="text-3xl font-bold leading-tight tracking-[-0.02em]">
								{t('prelease_title')}
							</h1>
							<p className="text-base leading-[1.35] tracking-[0.04em] text-ink/80">
								{t('prerelease_description')}
							</p>
						</hgroup>
					}
					bottom={<BetaNotice />}
				/>
			}
			actions={
				<ButtonLink to="../new-library" replace variant="accent">
					{t('continue')}
				</ButtonLink>
			}
		>
			<div className="noise size-full bg-[#111116]/95">
				<div className="flex items-center justify-center">
					<h1>placeholder do some content here</h1>
				</div>
			</div>
		</OnboardingLayout>
	);
}
