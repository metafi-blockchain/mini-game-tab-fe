// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';

// interface IImageSequence {
// 	className?: string;
// 	onClick?: (event: React.TouchEvent<HTMLDivElement>) => void;
// 	frameDuration?: number;
// 	totalFrames?: number;
// }

// const ImageSequence = ({
// 	className = '',
// 	onClick,
// 	frameDuration = 100,
// 	totalFrames = 9
// }: IImageSequence) => {
// 	const [frameIndex, setFrameIndex] = useState(0);
// 	const [isAnimating, setIsAnimating] = useState(false);
// 	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
// 	const intervalRef = useRef<NodeJS.Timeout | null>(null);

// 	const frames = Array.from(
// 		{ length: totalFrames },
// 		(_, i) => `/images/xspeed/xspeed_0000${i}.png`
// 	);

// 	useEffect(() => {
// 		const preloadImages = () => {
// 			frames.forEach(src => {
// 				const img = new Image();
// 				img.src = src;
// 			});
// 		};

// 		preloadImages();
// 	}, []);

// 	const handleTouch = (event: React.TouchEvent<HTMLDivElement>) => {
// 		if (onClick) {
// 			onClick(event);
// 		}

// 		setFrameIndex(prevIndex => (prevIndex + 1) % Math.min(9, totalFrames));

// 		if (timeoutRef.current) {
// 			clearTimeout(timeoutRef.current);
// 		}

// 		timeoutRef.current = setTimeout(() => {
// 			setIsAnimating(true);
// 		}, 200);
// 	};

// 	useEffect(() => {
// 		if (isAnimating) {
// 			intervalRef.current = setInterval(() => {
// 				setFrameIndex(prevIndex => {
// 					const nextIndex = (prevIndex + 1) % totalFrames;
// 					if (nextIndex === 0) {
// 						setIsAnimating(false);
// 						if (intervalRef.current) clearInterval(intervalRef.current);
// 					}
// 					return nextIndex;
// 				});
// 			}, frameDuration);
// 		}

// 		return () => {
// 			if (intervalRef.current) clearInterval(intervalRef.current);
// 		};
// 	}, [isAnimating, frameDuration, totalFrames]);

// 	return (
// 		<motion.div
// 			className={`${className} `}
// 			onTouchStart={handleTouch}
// 			key={frameIndex}
// 			initial={{ opacity: 0, scale: 1 }}
// 			animate={{ opacity: 1, scale: 1 }}
// 			exit={{ opacity: 0, scale: 1 }}
// 			transition={{
// 				duration: 0.3,
// 				ease: [0.4, 0, 0.2, 1]
// 			}}
// 		>
// 			<img
// 				src={frames[frameIndex]}
// 				alt={`frame-${frameIndex}`}
// 				className="w-full h-full object-cover"
// 			/>
// 		</motion.div>
// 	);
// };

// export default ImageSequence;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface IImageSequence {
	className?: string;
	onClick?: (event: React.TouchEvent<HTMLDivElement>) => void;
	frameDuration?: number;
	totalFrames?: number;
}

const ImageSequence = ({
	className = '',
	onClick,
	frameDuration = 100,
	totalFrames = 10
}: IImageSequence) => {
	const [frameIndex, setFrameIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const frames = Array.from(
		{ length: totalFrames },
		(_, i) => `/images/xspeed/xspeed_0000${i}.png`
	);

	useEffect(() => {
		const preloadImages = () => {
			frames.forEach(src => {
				const img = new Image();
				img.src = src;
			});
		};

		preloadImages();
	}, []);

	const handleTouch = (event: React.TouchEvent<HTMLDivElement>) => {
		if (onClick) {
			onClick(event);
		}

		if (!isAnimating) {
			setIsAnimating(true);
			setFrameIndex(0);

			startAnimation();
		}
	};

	const startAnimation = () => {
		intervalRef.current = setInterval(() => {
			setFrameIndex(prevIndex => {
				const nextIndex = (prevIndex + 1) % totalFrames;
				if (nextIndex === 0) {
					setIsAnimating(false);
					clearInterval(intervalRef.current!);
				}
				return nextIndex;
			});
		}, frameDuration);
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return (
		<motion.div
			className={`${className}`}
			onTouchStart={handleTouch}
			key={frameIndex}
			initial={{ opacity: 1, scale: 1 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 1, scale: 1 }}
			transition={{
				duration: 0.3,
				ease: [0.4, 0, 0.2, 1]
			}}
		>
			<img
				src={frames[frameIndex]}
				alt={`frame-${frameIndex}`}
				className="w-full h-full object-cover"
			/>
		</motion.div>
	);
};

export default ImageSequence;
