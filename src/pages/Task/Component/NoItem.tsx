import React from 'react';

export const NoItem = () => {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-1">
			<img
				width={32}
				height={32}
				src="/images/icons/box-empty.svg"
				alt="fast-wind-icon"
			/>
			<span className="text-[#FFFFFF99] text-sm">No tasks yet</span>
		</div>
	);
};
