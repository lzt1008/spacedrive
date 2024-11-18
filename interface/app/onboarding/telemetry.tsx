import { useNavigate } from 'react-router-dom';
import { Button, Form, RadioGroupField } from '@sd/ui';
import { useLocale } from '~/hooks';
import { usePlatform } from '~/util/Platform';

import { OnboardingLayout } from './components';
import { shareTelemetry, useOnboardingContext } from './context';

export default function OnboardingTelemetry() {
	const { t } = useLocale();
	const navigate = useNavigate();
	const { forms, submit } = useOnboardingContext();
	const form = forms.useForm('telemetry');
	const platform = usePlatform();

	return (
		<Form
			form={form}
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col items-center"
		>
			<OnboardingLayout
				title={t('onboarding_telemetry_title')}
				description={t('onboarding_telemetry_description')}
				privacy={{
					description: t('onboarding_telemetry_privacy'),
					href: 'https://www.spacedrive.com/docs/company/legal/privacy'
				}}
				actions={
					<Button
						type="submit"
						variant="accent"
						size="onboardingFixed"
						disabled={
							!['full', 'minimal', 'none'].includes(form.watch('shareTelemetry'))
						}
					>
						{t('continue')}
					</Button>
				}
			>
				<div className="m-6">
					<RadioGroupField.Root {...form.register('shareTelemetry')}>
						{shareTelemetry.options.map(({ value, heading, description }) => (
							<RadioGroupField.Item key={value} value={value}>
								<h1 className="font-bold">{heading}</h1>
								<p className="text-sm text-ink-faint">{description}</p>
							</RadioGroupField.Item>
						))}
					</RadioGroupField.Root>
				</div>
			</OnboardingLayout>
		</Form>
	);
}
