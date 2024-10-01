import React, { Fragment } from 'react';
import './index.scss';
import ProgressBar from '@ramonak/react-progress-bar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUserData, useUser } from '@/contexts/UserContext';
import { formatNumberDownRound } from '@/helpers';
import { handleGetClaimTapBot, handleInfinityTap, handleTap } from '@/services';
import { useDebounce } from '@/hook/useDebounce';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setDontFirstLoad, setTimeLeft } from '@/store/counterDownInfiniteTap';
import { RootState } from '@/store';
import type { AppDispatch } from '@/store';
import OkModal from '@/components/Modal';
import OKButton from '@/components/Button';
import { PrivateLayout } from '@/components/PrivateLayout';
import Toolbar from '@/components/Toolbar';
interface IBubble {
	id: number;
	value: string;
	x: number;
	y: number;
}
const Tap = () => {
	const dispatch = useDispatch<AppDispatch>();
	const timeLeft = useSelector((state: RootState) => state.countdown.timeLeft);
	const isFirstLoading = useSelector(
		(state: RootState) => state.countdown.firstLoad
	);
	const [bubbles, setBubbles] = useState<IBubble[]>([]);
	const [countTap, setCountTap] = useState<number>(0);
	const countRef = useRef(0);
	const startTimeTapRef = useRef(0);
	const navigate = useNavigate();
	const { userData } = useUser();
	const infoDataRef = useRef<IUserData | null>(null);
	const [totalBalance, setTotalBalance] = useState<number>(0);
	const [point, setPoint] = useState<number>(userData?.availableEnergy || 0);
	const isDisableBall = point < get(userData, 'multiTapValue', 0);
	const [countTapFree, setCountTapFree] = useState<number>(0);
	const [pointTapBot, setPointTapBot] = useState(0);
	const [isShowModalTapBot, setIsShowModalTapBot] = useState(false);
	useEffect(() => {
		if (timeLeft > 0) {
			setTimeout(() => {
				dispatch(setTimeLeft(0));
			}, 20000);
		}
	}, []);

	useEffect(() => {
		if (userData) {
			setPoint(userData.availableEnergy);
			setTotalBalance(userData.balance);
			infoDataRef.current = userData;
		}
	}, [userData]);
	const handleReset = () => {
		setCountTap(0);
		countRef.current = 0;
		startTimeTapRef.current = 0;
	};

	useDebounce({
		value: countTap,
		handle: handleTap,
		delay: 1000,
		handleReset: handleReset,
		startTime: startTimeTapRef.current,
		timeLeft: timeLeft
	});
	useEffect(() => {
		return () => {
			if (countRef.current > 0) {
				handleTap(countRef.current, startTimeTapRef.current.toString());
			}
		};
	}, []);

	const handleClickBall = (e: React.TouchEvent<HTMLImageElement>) => {
		const touchPoints = e.touches;
		const multiTapValue = get(userData, 'multiTapValue', 0);
		startTimeTapRef.current = Date.now();

		setPoint(prevPoint => {
			if (prevPoint <= 0) return prevPoint;

			for (let i = 0; i < touchPoints.length; i++) {
				const touch = touchPoints[i];
				const id = Date.now() + i;
				const { clientX, clientY } = touch;
				const target = e.target as HTMLImageElement;
				const rect = target.getBoundingClientRect();
				const x = clientX - rect.left;
				const y = clientY - rect.top;

				const tapValue = Math.min(multiTapValue, prevPoint - i * multiTapValue);

				if (tapValue <= 0) break;

				setBubbles(prevBubbles => [
					...prevBubbles,
					{ id, value: `+${tapValue}`, x, y }
				]);

				setTimeout(() => {
					setBubbles(prevBubbles =>
						prevBubbles.filter(bubble => bubble.id !== id)
					);
				}, 1000);

				const img = e.target as HTMLImageElement;
				img.classList.remove('active');
				void img.offsetWidth;
				img.classList.add('active');
				if (timeLeft > 0) {
					setCountTapFree(prevCount => prevCount + 1);
				}

				setTotalBalance(prevState => prevState + multiTapValue);
			}

			const pointsDeducted =
				timeLeft === 0 ? touchPoints.length * multiTapValue : 0;

			return Math.max(0, prevPoint - pointsDeducted);
		});

		countRef.current = countRef.current + touchPoints.length;
		setCountTap(prevCount => prevCount + touchPoints.length);
	};
	const handleSubmitInfinityTap = async () => {
		try {
			await handleInfinityTap(countTapFree);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		const interval = setInterval(() => {
			setPoint((prevPoint: any) => {
				if (typeof infoDataRef.current?.energyLimitValue === 'undefined') {
					return prevPoint;
				}
				if (
					prevPoint + (infoDataRef.current?.rechargeSpeedValue || 0) >
					infoDataRef.current?.energyLimitValue
				) {
					return infoDataRef.current?.energyLimitValue;
				}
				if (prevPoint < infoDataRef.current?.energyLimitValue) {
					return prevPoint + (infoDataRef.current?.rechargeSpeedValue || 0);
				}
				return prevPoint;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		if (timeLeft === 0 && countTapFree > 0) {
			handleSubmitInfinityTap();
		}
	}, [timeLeft]);
	const handleCloseModalTapBot = () => {
		dispatch(setDontFirstLoad());
		setTotalBalance(prev => Number(prev) + Number(pointTapBot));
		setPointTapBot(0);
		setIsShowModalTapBot(false);
	};
	const getTapBotPoint = async () => {
		try {
			const response = await handleGetClaimTapBot();
			const data = get(response, 'data.data', 0);
			if (data > 0) {
				setPointTapBot(data);
				setIsShowModalTapBot(true);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (userData?.haveTapBot && isFirstLoading) {
			getTapBotPoint();
		}
	}, [userData?.haveTapBot, isFirstLoading]);
	return (
		<Fragment>
			{/* <HeaderPage/> */}
			{timeLeft > 0 && (
				<ul className="g-snows absolute">
					{Array.from({ length: 20 }).map((_, i) => (
						<li key={i}></li>
					))}
				</ul>
			)}
			<div className="body-page">
				<div className="content-page">
					<div className="tab-basic-info relative">
						<div className="item-basic-info justify-around flex flex-col">
							<div className="basic-info-title text-white">Fanclub</div>
							<div className="flex gap-1 items-center justify-center">
								<img
									src="/images/icons/okcoin.svg"
									width={17}
									height={17}
									alt="icon-okcoin"
								/>
								<span className="text-white uppercase">Sports Hero</span>
							</div>
						</div>

						<div className="item-basic-info justify-around flex flex-col">
							<div className="basic-info-title color-green">Daily Points</div>
							{/*<div className="flex gap-1 justify-center">
								<img src="/images/icons/coin.svg" alt="icon-coin" />
								<span className="text-white">108.7K</span>
							</div>*/}
							<span className="text-center text-white flex items-center justify-center gap-1">
								<img src="/images/icons/coin.svg" alt="icon-coin" />-
							</span>
						</div>

						<div className="item-basic-info justify-around flex flex-col">
							<div className="basic-info-title text-white">Your Idol</div>
							{/*<div className="flex gap-1">
								<img src="/images/icons/coin.svg" alt="icon-coin-1" />
								<span className="text-white">108.7K</span>
							</div>*/}
							<span className="text-center text-white flex items-center justify-center gap-1">
								<img src="/images/icons/coin.svg" alt="icon-coin" />-
							</span>
						</div>
					</div>
					<div className="flex-1 flex flex-col justify-around relative">
						<div className="flex-1 flex flex-col">
							<div className="flex flex-col items-center">
								<div className="flex flex-row items-center gap-3">
									<img
										src="/images/icons/coin.svg"
										alt="icon-okcoin"
										width={36}
									/>
									<h1 className="text-[42px] m-0 text-white font-semibold">
										{formatNumberDownRound(totalBalance)}
									</h1>
								</div>
								{timeLeft === 0 && (
									<span
										className="coin-basic flex"
										onClick={() => navigate('/tap/badge-detail')}
									>
										<span className="text-white">{userData?.userRank}</span>
										<img
											src="/images/icons/arrow-right.svg"
											alt="icon-arrow-right"
										/>
									</span>
								)}
							</div>
							<div className="flex justify-center flex-1 flex-col items-center relative">
								{bubbles.map(bubble => (
									<div
										key={bubble.id}
										className="bubble"
										style={{ left: bubble.x, top: bubble.y }}
									>
										{bubble.value}
									</div>
								))}
								{userData && (
									<img
										onTouchStart={handleClickBall}
										className={`${
											!isDisableBall && 'ball-action'
										} max-w-[312px] max-h-[310px]`}
										src={
											['bronze', 'gold', 'silver'].includes(
												userData?.userRank?.toString().toLowerCase()
											)
												? `/images/ball/${userData?.userRank
														?.toString()
														.toLowerCase()}-ball.webp`
												: `/images/ball/diamond-ball.webp`
										}
										alt="icon-ball"
									/>
								)}
							</div>
						</div>

						<div className="flex flex-col items-center min-h-[34px]">
							<div className="flex items-center gap-1">
								<img
									src="/images/icons/lightning.svg"
									alt="icon-lightning"
									width={14}
									height={19}
								/>
								<span className="text-white">
									{point}/{userData?.energyLimitValue || 1}
								</span>
							</div>
							<div className="w-full">
								<ProgressBar
									maxCompleted={100}
									completed={(point / (userData?.energyLimitValue || 1)) * 100}
									customLabel={' '}
									barContainerClassName="bar-container"
									className="bar-wrapper"
								/>
							</div>
						</div>
					</div>
				</div>
				<Toolbar />
			</div>
			<OkModal
				isOpen={isShowModalTapBot}
				setIsOpen={handleCloseModalTapBot}
				position="center"
				renderBody={
					<>
						<div className="flex flex-col gap-3">
							<div
								style={{
									backgroundColor: 'rgb(34 29 57)',
									width: 120,
									height: 120,
									borderRadius: 20,
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									display: 'flex'
								}}
							>
								<img
									src={'/images/icons/tap-bot.svg'}
									style={{ width: 80, height: 80 }}
								/>
							</div>
							<h2 className="m-0 p-0 text-center font-semibold text-white text-3xl">
								Tap Bot
							</h2>
							<p className="m-0 p-0 text-sm text-center text-[#FFFFFF99] mt-2">
								While you were asleep, your Tap Bot earned <br />
								some Shares for you{' '}
								<img
									src={'/images/icons/red-heart.svg'}
									width={24}
									height={24}
									style={{ marginLeft: 3, paddingTop: 8 }}
								/>
							</p>
							<div className="flex flex-row gap-2 justify-center mt-3">
								<img src="/images/icons/coin.svg" alt="icon-coin" />
								<p
									className="m-0 p-0 text-white font-semibold"
									style={{ fontSize: 26 }}
								>
									{formatNumberDownRound(pointTapBot)}
								</p>
							</div>

							<OKButton
								handleOnClick={handleCloseModalTapBot}
								// isLoading={isLoadingClaimTapBot}
								rootClass="text-white text-base rounded-xl"
								text="Get it!"
							></OKButton>
						</div>
					</>
				}
			/>
		</Fragment>
	);
};
export default Tap;
