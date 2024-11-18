import { useNavigate } from 'react-router';
import { Button, Form, InputField } from '@sd/ui';
import { Icon } from '~/components';
import { useLocale, useOperatingSystem } from '~/hooks';

import { OnboardingLayout } from './components';
import { useOnboardingContext } from './context';

export default function OnboardingNewLibrary() {
	const { t } = useLocale();

	const navigate = useNavigate();
	const os = useOperatingSystem();
	const form = useOnboardingContext().forms.useForm('new-library');

	return (
		<Form
			form={form}
			onSubmit={form.handleSubmit(() => {
				navigate(`../${os === 'macOS' ? 'full-disk' : 'locations'}`, { replace: true });
			})}
		>
			<OnboardingLayout
				title={t('create_a_library')}
				description={t('create_a_library_description')}
				privacy={{
					description: 'TODO: Library privacy description',
					href: 'https://www.spacedrive.com/docs/company/legal/privacy'
				}}
				actions={
					<Button
						type="submit"
						variant="accent"
						size="onboardingFixed"
						disabled={!form.formState.isValid}
					>
						{t('continue')}
					</Button>
				}
			>
				<Icon name="Database" size={80} />
				<InputField
					{...form.register('name')}
					size="lg"
					autoFocus
					className="mt-6 w-[300px]"
					placeholder={'e.g. "James\' Library"'}
				/>
			</OnboardingLayout>
		</Form>
	);
}
