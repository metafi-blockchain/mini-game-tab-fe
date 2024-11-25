import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface OHTTooltipProps {
	children: any;
	tooltip: string;
}
function OHTTooltip({ children, tooltip }: OHTTooltipProps) {
	const renderTooltip = (props: any) =>
		tooltip ? (
			<Tooltip data-bs-theme="dark" {...props}>
				{tooltip}
			</Tooltip>
		) : (
			<></>
		);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevents the event from bubbling up
	};

	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<span style={{ cursor: 'pointer' }} onClick={handleClick}>
				{children}
			</span>
		</OverlayTrigger>
	);
}
export default OHTTooltip;
