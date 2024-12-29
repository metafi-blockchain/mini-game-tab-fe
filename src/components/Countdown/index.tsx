// import React, { useEffect, useState } from 'react';
// import './index.scss';
// const Countdown: React.FC = () => {
// 	const [value, setValue] = useState(20);
// 	const [isBig, setIsBig] = useState(true);

// 	useEffect(() => {
// 		const intervalID = setInterval(() => {
// 			setValue(prevValue => {
// 				const nextValue = prevValue - 1;

// 				if (nextValue < 0) {
// 					clearInterval(intervalID);
// 				}

// 				requestAnimationFrame(() => {
// 					setIsBig(false);

// 					requestAnimationFrame(() => {
// 						setIsBig(true);
// 					});
// 				});

// 				return nextValue;
// 			});
// 		}, 1000);

// 		return () => clearInterval(intervalID);
// 	}, []);

// 	return (
// 		<div id="counter" className="text-[#F5C033]">
// 			{value >= 0 && value}
// 		</div>
// 	);
// };

// export default Countdown;

import React, { useState, useEffect } from 'react';

interface ICountdown {
	initialSeconds: number;
}

const Countdown = ({ initialSeconds }: ICountdown) => {
	const [seconds, setSeconds] = useState(initialSeconds);

	useEffect(() => {
		if (seconds <= 0) return; // Stop countdown at 0

		const interval = setInterval(() => {
			setSeconds(prevSeconds => prevSeconds - 1);
		}, 1000);

		return () => clearInterval(interval); // Cleanup interval on unmount
	}, [seconds]);

	const formatTime = (secs: number) => {
		const minutes = Math.floor(secs / 60);
		const seconds = secs % 60;
		if (minutes > 0) {
			return `${minutes.toString().padStart(2, '0')}:${seconds
				.toString()
				.padStart(2, '0')}`;
		}
		if (seconds > 0) return seconds;
		return '';
	};

	return (
		<div className="relative flex items-center justify-center min-h-[80px]">
			<p style={{ color: '#F5C033' }}>{formatTime(seconds)}</p>
		</div>
	);
};

export default Countdown;
