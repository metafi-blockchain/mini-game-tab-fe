//@ts-ignore
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Counting = () => {
	const [progressPercent, setProgressPercent] = useState(0);
	const [count, setCount] = useState(20);
	const radius = 100; // radius of the circle
	const circumference = 2 * Math.PI * radius;
	const navigate = useNavigate();

	useEffect(() => {
		const progressCircle: any = document.querySelector('.progress');

		// Set initial styles
		progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
		progressCircle.style.transition = 'stroke-dashoffset 0.5s ease-in-out'; // Smooth transition

		const progressInterval = setInterval(() => {
			if (count === 1) {
				clearInterval(progressInterval);
				setProgressPercent(100);
			} else {
				const newPercent = (3 - count) * 33.33;
				setProgressPercent(newPercent);
				progressCircle.style.strokeDashoffset =
					circumference - (newPercent / 100) * circumference;
			}
			if (count === 0) {
				clearInterval(progressInterval);
				navigate('/other'); // Redirect to '/other' route when countdown completes
			}
			setCount(prevCount => prevCount - 1);
		}, 1000);

		return () => {
			clearInterval(progressInterval);
		};
	}, [count, circumference, navigate]);

	return (
		<div className="center-card">
			<div className="countdown-circle">
				<svg width="250" height="250">
					{/* Background track circle */}
					<circle
						r="100"
						cx="125"
						cy="125"
						className="track"
						style={{ fill: 'rgba(0,0,0,0.3)' }}
					></circle>
					{/* Progress circle */}
					<circle
						r="100"
						cx="125"
						cy="125"
						className="progress"
						style={{
							fill: 'none',
							stroke: '#fff',
							strokeWidth: '10px',
							strokeDashoffset: `calc(${circumference} - (${progressPercent} / 100) * ${circumference})`
						}}
					></circle>
					{/* Countdown text */}
					{count > -1 && (
						<text
							x="50%"
							y="50%"
							style={{
								transform: 'none',
								fill: '#fff',
								fontSize: '60px',
								fontWeight: 'bold'
							}}
							dominantBaseline="middle"
							textAnchor="middle"
							className="progress-text"
						>
							0{count}
						</text>
					)}
				</svg>
			</div>
		</div>
	);
};

export default Counting;
