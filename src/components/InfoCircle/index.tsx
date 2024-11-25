import React from 'react';

const InfoCircle = () => {
	return (
		<div style={{ display: 'inline-block', position: 'relative' }}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="rgba(255, 255, 255, 0.6)"
				width="16px"
				height="16px"
				style={{ cursor: 'pointer' }}
			>
				<path
					fillRule="evenodd"
					d="M12 2a10 10 0 100 20 10 10 0 000-20zm-.75 5.25a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zM12 9.75a.75.75 0 00-.75.75v5a.75.75 0 001.5 0v-5a.75.75 0 00-.75-.75z"
					clipRule="evenodd"
				/>
			</svg>
		</div>
	);
};

export default InfoCircle;
