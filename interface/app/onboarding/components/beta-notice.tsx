import { PaperPlaneTilt, SealWarning } from '@phosphor-icons/react';

export default function BetaNotice() {
	return (
		<div className="flex flex-col gap-y-1 font-plex">
			<div className="flex flex-row items-center gap-x-2 text-base font-semibold leading-5 tracking-wide text-pastel-yellow">
				<SealWarning weight="fill" className="size-6">
					{/* fill the exclamation point in with a dark orange */}
					{/* icon's viewBox is 256x256 so position the center at x=128 y=128 & give it 128px radius */}
					{/* -ilynxcat 11/nov/2024 */}
					<circle cx="128" cy="128" r="64" fill="#A34E00" />
				</SealWarning>
				<h2>This is a beta release.</h2>
			</div>
			<p className="ml-8 text-sm leading-5 tracking-[0.04em] text-ink-dull">
				While we are still working to build a polished experience, please report any issues
				encountered with{' '}
				<span className="inline-flex items-baseline gap-x-1 text-white">
					<PaperPlaneTilt size={16} weight="regular" className="size-4 self-center" />{' '}
					Give
				</span>
				{
					' ' /* manually added so that the breaks between Give and Feedback, not between the icon and Give. */
				}
				<span className="text-white">Feedback</span> in the bottom left of the app.
			</p>
		</div>
	);
}
