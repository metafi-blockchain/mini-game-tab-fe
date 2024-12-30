// // import React, { useEffect, useState } from 'react';
// // import './index.scss';
// // const Countdown: React.FC = () => {
// // 	const [value, setValue] = useState(20);
// // 	const [isBig, setIsBig] = useState(true);

// // 	useEffect(() => {
// // 		const intervalID = setInterval(() => {
// // 			setValue(prevValue => {
// // 				const nextValue = prevValue - 1;

// // 				if (nextValue < 0) {
// // 					clearInterval(intervalID);
// // 				}

// // 				requestAnimationFrame(() => {
// // 					setIsBig(false);

// // 					requestAnimationFrame(() => {
// // 						setIsBig(true);
// // 					});
// // 				});

// // 				return nextValue;
// // 			});
// // 		}, 1000);

// // 		return () => clearInterval(intervalID);
// // 	}, []);

// // 	return (
// // 		<div id="counter" className="text-[#F5C033]">
// // 			{value >= 0 && value}
// // 		</div>
// // 	);
// // };

// // export default Countdown;

// import React, { useState, useEffect } from 'react';

// interface ICountdown {
// 	initialSeconds: number;
// }

// const Countdown = ({ initialSeconds }: ICountdown) => {
// 	const [seconds, setSeconds] = useState(initialSeconds);

// 	useEffect(() => {
// 		if (seconds <= 0) return; // Stop countdown at 0

// 		const interval = setInterval(() => {
// 			setSeconds(prevSeconds => prevSeconds - 1);
// 		}, 1000);

// 		return () => clearInterval(interval); // Cleanup interval on unmount
// 	}, [seconds]);

// 	const formatTime = (secs: number) => {
// 		const minutes = Math.floor(secs / 60);
// 		const seconds = secs % 60;
// 		if (minutes > 0) {
// 			return `${minutes.toString().padStart(2, '0')}:${seconds
// 				.toString()
// 				.padStart(2, '0')}`;
// 		}
// 		if (seconds > 0) return seconds;
// 		return '';
// 	};

// 	return (
// 		<div className="relative flex items-center justify-center min-h-[80px]">
// 			<span style={{ color: '#F5C033' }}>{formatTime(seconds)}</span>
// 			<span>la sao ta</span>
// 		</div>
// 	);
// };

// export default Countdown;

import React, { useState, useEffect } from 'react';
import CountdownLib from 'react-countdown';

interface ICountdownComponent {
	timeLeft: any;
	elseCom: any;
}

const CountdownComponent = ({ timeLeft, elseCom }: ICountdownComponent) => {
	const [targetDate, setTargetDate] = useState(0);

	useEffect(() => {
		if (timeLeft > 0) {
			setTargetDate(Date.now() + 19000); // Set the countdown target time
		}
	}, [timeLeft]); // Run only when timeLeft changes

	const rendererCountdown = ({ seconds, completed }: any) => {
		if (completed) {
			return elseCom;
		} else {
			return <span style={{ color: '#F5C033', fontSize: 20 }}>{seconds}</span>;
		}
	};

	return timeLeft > 0 && targetDate ? (
		<div className="relative flex items-center justify-center min-h-[80px]">
			<CountdownLib date={targetDate} renderer={rendererCountdown} />
		</div>
	) : (
		elseCom
	);
};

export default CountdownComponent;
