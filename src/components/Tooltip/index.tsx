import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface OHTTooltipProps {
	children: any;
	tooltip: string;
}
function OHTTooltip({ children, tooltip }: OHTTooltipProps) {
	const renderTooltip = (props: any) =>
		tooltip ? (
			<Tooltip data-bs-theme="light" {...props}>
				{tooltip}
			</Tooltip>
		) : (
			<></>
		);

	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			{children}
		</OverlayTrigger>
	);
}
export default OHTTooltip;
