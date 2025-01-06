//@ts-ignore
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Counting = () => {
	const [progressPercent, setProgressPercent] = useState(0);
	const [count, setCount] = useState(20);
	const radius = 20; // Adjusted to match SVG circle
	const circumference = 2 * Math.PI * radius;
	const navigate = useNavigate();

	useEffect(() => {
		const progressCircle: any = document.querySelector('.progress');

		// Set initial styles
		progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
		progressCircle.style.transition = 'stroke-dashoffset 0.5s ease-in-out';

		const progressInterval = setInterval(() => {
			if (count === 0) {
				clearInterval(progressInterval);
				setProgressPercent(100); // Ensure it reaches 100% at the end
			} else {
				const newPercent = ((20 - count + 1) / 20) * 100;
				setProgressPercent(newPercent);
				progressCircle.style.strokeDashoffset =
					circumference - (newPercent / 100) * circumference;
				setCount(prevCount => prevCount - 1);
			}
		}, 1000);

		return () => {
			clearInterval(progressInterval);
		};
	}, [count, circumference, navigate]);

	return (
		<div className="center-card">
			<div className="countdown-circle">
				<svg width="80" height="80">
					<circle
						r="20"
						cx="40"
						cy="40"
						className="track"
						style={{ fill: 'transparent' }}
					></circle>
					<circle
						r="20"
						cx="40"
						cy="40"
						className="progress"
						style={{
							fill: 'none',
							stroke: '#F5C033',
							strokeWidth: '3px',
							strokeDashoffset: `${
								circumference - (progressPercent / 100) * circumference
							}`
						}}
					></circle>

					{count >= 0 && (
						<text
							x="50%"
							y="50%"
							style={{
								transform: 'none',
								fill: '#F5C033',
								fontSize: '20px',
								fontWeight: 'bold'
							}}
							dominantBaseline="middle"
							textAnchor="middle"
							className="progress-text"
						>
							{count}
						</text>
					)}
				</svg>
			</div>
		</div>
	);
};

export default Counting;
