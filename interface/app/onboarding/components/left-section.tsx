import { ReactNode } from 'react';
import { useDebugState } from '@sd/client';
import { tw } from '@sd/ui';
import DebugPopover from '~/app/$libraryId/Layout/Sidebar/DebugPopover';

import { PrivacyDisclosure, PrivacyDisclosureInfo } from './privacy-disclosure';

type OnboardingLeftSectionProps = {
	title: string;
	description: string;
	privacyInfo?: PrivacyDisclosureInfo;
	actions?: ReactNode;
};

type OnboardingCustomLeftSectionProps = {
	className?: string;
	style?: React.CSSProperties;
	top: ReactNode;
	bottom: ReactNode;
};

export const OnboardingCustomLeftSection = (props: OnboardingCustomLeftSectionProps) => {
	const debugState = useDebugState();
	const { className, style, top, bottom } = props;

	return (
		<LeftSectionWrapper className={className} style={style}>
			<div className="flex h-full flex-col">
				<div className="grow">{top}</div>
				<div>{bottom}</div>
			</div>
			{debugState.enabled && (
				<div className="absolute bottom-1 left-1">
					<DebugPopover />
				</div>
			)}
		</LeftSectionWrapper>
	);
};

export const OnboardingLeftSection = (props: OnboardingLeftSectionProps) => {
	const debugState = useDebugState();
	const { title, description, privacyInfo } = props;

	return (
		<LeftSectionWrapper>
			<div className="flex h-full flex-col">
				<div className="flex min-h-0 shrink-0 grow flex-col gap-y-6 overflow-y-scroll">
					<h1 className="font-plex text-2xl font-bold leading-8 tracking-[-0.02em] text-white">
						{title}
					</h1>
					<p className="whitespace-pre-line text-base leading-[1.4] tracking-[0.02em] text-ink/80">
						{description}
					</p>
				</div>

				{privacyInfo && <PrivacyDisclosure {...privacyInfo} />}
			</div>
			{debugState.enabled && (
				<div className="absolute bottom-1 left-1">
					<DebugPopover />
				</div>
			)}
		</LeftSectionWrapper>
	);
};

const LeftSectionWrapper = tw.header`
	max-w-[28rem] h-full pt-[3.5rem] pb-[5.25rem] px-7
	border-r border-app-frame
`;
