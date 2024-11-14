import { createMutable } from 'solid-js/store';

import { createPersistedMutable, useSolidStore } from '../solid';

export enum UseCase {
	CameraRoll = 'cameraRoll',
	MediaConsumption = 'mediaConsumption',
	MediaCreation = 'mediaCreation',
	CloudBackup = 'cloudBackup',
	Other = 'other'
}

export type OnboardingPage =
	| 'prerelease'
	| 'new-library'
	| 'full-disk'
	| 'locations'
	| 'telemetry'
	| 'creating-library';

const onboardingStoreDefaults = () => ({
	unlockedScreens: ['prerelease'] as OnboardingPage[],
	lastActiveScreen: null as OnboardingPage | null,
	useCases: [] as UseCase[],
	grantedFullDiskAccess: false,
	data: {} as Record<string, any> | undefined,
	showIntro: true
});

export const onboardingStore = createPersistedMutable(
	'onboarding',
	createMutable(onboardingStoreDefaults())
);

export function useOnboardingStore() {
	return useSolidStore(onboardingStore);
}

export function resetOnboardingStore() {
	Object.assign(onboardingStore, onboardingStoreDefaults());
}

export function unlockOnboardingScreen(key: OnboardingPage) {
	onboardingStore.lastActiveScreen = key;
	if (!onboardingStore.unlockedScreens.includes(key)) {
		onboardingStore.unlockedScreens = [...onboardingStore.unlockedScreens, key];
	}
}
