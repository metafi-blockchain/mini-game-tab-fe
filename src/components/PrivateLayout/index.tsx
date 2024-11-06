import React, { PropsWithChildren } from 'react';
import Toolbar from '../Toolbar';

export const PrivateLayout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
				{children}
			</div>
			<div>
				<Toolbar />
			</div>
		</>
	);
};
