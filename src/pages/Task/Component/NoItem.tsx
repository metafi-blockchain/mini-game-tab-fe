import React from 'react';

interface NoItemProps {
	msg?: string;
}

export const NoItem = ({ msg }: NoItemProps) => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-1">
			<img
				width={32}
				height={32}
				src="/images/icons/box-empty.svg"
				alt="fast-wind-icon"
			/>
			<span className="text-[#FFFFFF99] text-sm">{msg ?? 'No tasks yet'}</span>
		</div>
	);
};
