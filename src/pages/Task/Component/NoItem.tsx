import React from 'react';

interface NoItemProps {
	msg?: string;
	subMsg?: string;
	cls?: string;
}

export const NoItem = ({ msg, subMsg, cls }: NoItemProps) => {
	return (
		<div
			className={`flex flex-1 flex-col items-center justify-center gap-1 ${cls}`}
		>
			<img
				width={32}
				height={32}
				src="/images/icons/box-empty.svg"
				alt="fast-wind-icon"
			/>
			<span className="text-[#FFFFFF99] text-sm">{msg ?? 'No tasks yet'}</span>
			{subMsg && (
				<span className="text-[#FFFFFF99] text-sm text-center mt-2">
					{subMsg ?? ''}
				</span>
			)}
		</div>
	);
};
