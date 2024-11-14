import { BookOpenText } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

export type PrivacyDisclosureInfo = {
	description: string;
	href: string;
	hrefLabel?: string;
};

type PrivacyDisclosureProps = PrivacyDisclosureInfo & {
	className?: string;
};

export const PrivacyDisclosure: React.FC<PrivacyDisclosureProps> = ({
	className,
	description,
	href,
	hrefLabel = 'Privacy details'
}) => {
	return (
		<div
			className={clsx('flex flex-col items-start gap-y-2.5 text-start font-plex', className)}
		>
			<p className="max-w-lg text-balance text-base leading-5 tracking-wide text-gray-350">
				{description}
			</p>
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="flex cursor-pointer flex-row items-center gap-x-2 px-0.5 text-sm font-medium leading-none tracking-wider text-pastel-blue hover:underline"
			>
				<BookOpenText size={20} />
				{hrefLabel}
			</a>
		</div>
	);
};
