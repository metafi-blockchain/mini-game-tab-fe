import React, { useEffect, useState } from 'react';
import './index.scss';
const Countdown: React.FC = () => {
	const [value, setValue] = useState(20);
	const [isBig, setIsBig] = useState(true);

	useEffect(() => {
		const intervalID = setInterval(() => {
			setValue(prevValue => {
				const nextValue = prevValue - 1;

				if (nextValue < 0) {
					clearInterval(intervalID);
				}

				requestAnimationFrame(() => {
					setIsBig(false);

					requestAnimationFrame(() => {
						setIsBig(true);
					});
				});

				return nextValue;
			});
		}, 1000);

		return () => clearInterval(intervalID);
	}, []);

	return (
		<div id="counter" className="text-[#F5C033]">
			{value >= 0 && value}
		</div>
	);
};

export default Countdown;
