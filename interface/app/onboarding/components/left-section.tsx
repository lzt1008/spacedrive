import { ReactNode } from 'react';
import { useDebugState } from '@sd/client';
import { tw } from '@sd/ui';
import DebugPopover from '~/app/$libraryId/Layout/Sidebar/DebugPopover';

import { PrivacyDisclosure, PrivacyDisclosureInfo } from './privacy-disclosure';

interface OnboardingLeftSectionBaseProps {
	className?: string;
	style?: React.CSSProperties;
}

type DefaultVariantProps = OnboardingLeftSectionBaseProps & {
	kind: 'default';
	title: string;
	description: string;
	privacyInfo?: PrivacyDisclosureInfo;
};

type CustomContentVariantProps = OnboardingLeftSectionBaseProps & {
	kind: 'customContent';
	top: ReactNode;
	bottom: ReactNode;
};

export type OnboardingLeftSectionProps = DefaultVariantProps | CustomContentVariantProps;

export const OnboardingLeftSection = (props: OnboardingLeftSectionProps) => {
	const debugState = useDebugState();
	const { className, style } = props;

	return (
		<LeftSectionWrapper className={className} style={style}>
			<div className="flex h-full flex-col">
				{props.kind === 'default' ? (
					<>
						<div className="flex min-h-0 shrink-0 grow flex-col gap-y-6 overflow-y-scroll">
							<h1 className="font-plex text-2xl font-bold leading-8 tracking-[-0.02em] text-white">
								{props.title}
							</h1>
							<p className="whitespace-pre-line text-base leading-[1.4] tracking-[0.02em] text-ink/80">
								{props.description}
							</p>
						</div>
						{props.privacyInfo && <PrivacyDisclosure {...props.privacyInfo} />}
					</>
				) : (
					<>
						<div className="grow">{props.top}</div>
						<div>{props.bottom}</div>
					</>
				)}
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
