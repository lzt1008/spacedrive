import { Loader } from '@sd/ui';
import { useLocale } from '~/hooks';

import { OnboardingLayout } from './components';

export default function OnboardingCreatingLibrary() {
	const { t } = useLocale();

	return (
		<OnboardingLayout
			title={t('creating_your_library')}
			description={t('creating_your_library') + '...'}
			privacy={{
				description: 'TODO: Library privacy description',
				href: 'https://www.spacedrive.com/docs/company/legal/privacy'
			}}
		>
			<span className="text-6xl">🛠</span>
			<Loader className="mt-5" />
		</OnboardingLayout>
	);
}
