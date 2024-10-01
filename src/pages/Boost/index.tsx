/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
	TonConnectButton,
	UserRejectsError,
	useTonConnectUI,
	useTonWallet
} from '@tonconnect/ui-react';
import './index.scss';
import ItemBooster, {
	IPropItemBooster
} from '@/pages/Boost/Component/ItemBooster';
import OkModal from '@/components/Modal';
import { handleBoost, handleEnergyRefill, makeTx } from '@/services';
import { findIndex, get } from 'lodash';
import { IUserData, useUser } from '@/contexts/UserContext';
import { formatNumberDownRound } from '@/helpers';
import OkBaseButton from '@/components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/store/counterDownInfiniteTap';
import type { AppDispatch } from '@/store';
import { RootState } from '@/store';
import { PrivateLayout } from '@/components/PrivateLayout';
import { pTimeout, pTimeoutException } from '@/utils';
import { getTxDepositStatus } from '@/services/auth';
import { TIME_BUY_BOT, TRY_BUY_BOT } from '@/constants';
import { toast } from 'react-toastify';
interface IPropsBodyModal {
	icon: ReactNode;
	title: string;
	subtitle: string;
	description: string | undefined;
	contentButton: string | ReactNode;
	balance?: number;
	price?: number;
	type?: number | null;
	isDisabled: boolean;
	handleForTop: boolean;
	isTapInfinite?: boolean;
}
// public enum BoostType
// {
//     RechargeSpeed = 0,
//     MultiTap = 1,
// }
type IExistOrNo = number | null | undefined;
const OkBoost = () => {
	const [tonConnectUI, setOptions] = useTonConnectUI();
	// const [balance, setBalance] = useState(null);
	const [checking, setChecking] = useState(false);
	const interval = useRef<any>();
	const interval2 = useRef<any>();
	const [message, setMessage] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const wallet = useTonWallet();
	const timeLeft = useSelector((state: RootState) => state.countdown.timeLeft);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { userData, boostList, getMeInfo } = useUser();
	const teleId = get(userData, 'telegramId', '');
	const [isShowModal, setIsShowModal] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);
	const [infoData, setInfoData] = useState<IUserData | null>(null);
	const [isShowModalForDaily, setIsShowModalForDaily] =
		useState<boolean>(false);
	useEffect(() => {
		setInfoData(userData);
	}, [userData]);

	useEffect(() => {
		if (boostList && userData) {
			handleMakeBoostListData(boostList, userData);
		}
	}, [boostList, userData]);

	useEffect(() => {
		checkBuyAIBot();
	}, []);

	const checkBuyAIBot = async () => {
		try {
			const willCheck = localStorage.getItem(`${teleId}${TRY_BUY_BOT}`);
			const timeRequest = localStorage.getItem(`${teleId}${TIME_BUY_BOT}`);
			if (willCheck && timeRequest) {
				toast.warn(
					'You submitted to buy AI bot. We are verifying. Please wait.'
				);
				interval2.current = setInterval(() => {
					initCheckTxStatus(timeRequest);
				}, 10000);
			}
		} catch (error) {}
	};
	const initCheckTxStatus = async (time: string) => {
		try {
			const res = await getTxDepositStatus(time);
			if (get(res, 'data.success', false)) {
				const msg = get(res, 'data.message', '');
				const isSuccess = get(res, 'data.data', false);
				if (isSuccess) {
					toast.success(msg);
				} else {
					toast.error(msg);
				}
				getMeInfo();
				localStorage.setItem(`${teleId}${TRY_BUY_BOT}`, '');
				localStorage.setItem(`${teleId}${TIME_BUY_BOT}`, '');
				if (interval2.current) {
					clearInterval(interval2.current);
				}
			}
		} catch (error) {}
	};
	const handleMakeBoostListData = async (
		listBoost: any[],
		userData: IUserData
	) => {
		try {
			const temp: any = {};
			temp[0] = [];
			temp[1] = [];
			temp[2] = [];
			temp[3] = [];
			temp[4] = [];
			listBoost.forEach((item: IPropItemBooster) => {
				if (item?.type === 0) {
					temp[0].push({
						...item,
						boostName: 'Recharging Speed',
						src: '/images/icons/light-booster.svg'
					});
				} else if (item?.type === 1) {
					temp[1].push({
						...item,
						boostName: 'Multitap',
						src: '/images/icons/tap-booster.svg'
					});
				} else if (item?.type === 2) {
					temp[2].push({
						...item,
						boostName: 'Energy Limit',
						src: '/images/icons/fast-booster.svg'
					});
				} else if (item?.type === 3) {
					temp[3].push({
						...item,
						boostName: 'Tap Bot',
						src: '/images/icons/tap-bot.svg'
					});
				} else if (item?.type === 4) {
					temp[4].push({
						...item,
						boostName: 'AI Bot',
						src: '/images/icons/ai-bot.png'
					});
				}
			});
			const rechargeSpeedLevel = get(userData, 'rechargeSpeedLevel', 1);
			const multiTapLevel = get(userData, 'multiTapLevel', 1);
			const energyLimitLevel = get(userData, 'energyLimitLevel', 1);
			const haveTapBot = get(userData, 'haveTapBot', false);
			const havePremiumBot = get(userData, 'havePremiumBot', false);
			const result: any = [];
			Object.values(temp).forEach((item: any, index: number) => {
				if (index === 0) {
					const max = item?.length;
					const rechargeIdx = findIndex(
						item,
						(it: any) => it?.level === rechargeSpeedLevel
					);
					const nextLevel =
						rechargeSpeedLevel + 1 > max ? max : rechargeSpeedLevel + 1;
					if (rechargeIdx > -1) {
						if (item?.[rechargeIdx]?.level < max) {
							result.push({
								...item?.[rechargeIdx + 1],
								remaining: max - rechargeIdx - 1,
								nextLevel: nextLevel
							});
						} else {
							result.push({
								...item?.[rechargeIdx],
								remaining: 0,
								nextLevel: nextLevel
							});
						}
					}
				} else if (index === 1) {
					const max = item?.length;
					const multiIdx = findIndex(
						item,
						(it: any) => it?.level === multiTapLevel
					);
					const nextLevel = multiTapLevel + 1 > max ? max : multiTapLevel + 1;
					if (multiIdx > -1) {
						if (item?.[multiIdx]?.level < max) {
							result.push({
								...item?.[multiIdx + 1],
								remaining: max - multiIdx - 1,
								nextLevel: nextLevel
							});
						} else {
							result.push({
								...item?.[multiIdx],
								remaining: 0,
								nextLevel: nextLevel
							});
						}
					}
				} else if (index === 2) {
					const max = item?.length;
					const nextLevel =
						energyLimitLevel + 1 > max ? max : energyLimitLevel + 1;
					const energyIdx = findIndex(
						item,
						(it: any) => it?.level === energyLimitLevel
					);
					if (energyIdx > -1) {
						if (item?.[energyIdx]?.level < max) {
							result.push({
								...item?.[energyIdx + 1],
								remaining: max - energyIdx - 1,
								nextLevel: nextLevel
							});
						} else {
							result.push({
								...item?.[energyIdx],
								remaining: 0,
								nextLevel: nextLevel
							});
						}
					}
				} else if (index === 3) {
					const temp = get(item, '[0]', {});
					result.push({ ...temp, status: haveTapBot });
				} else if (index === 4) {
					const temp = get(item, '[0]', {});
					if (temp?.type === 4) {
						result.push({ ...temp, status: havePremiumBot });
					}
				}
			});
			setData(result);
		} catch (e) {
			console.log('1', e);
		}
	};
	const [contentModal, setContentModal] = useState<IPropsBodyModal>({
		icon: <></>,
		title: '',
		subtitle: '',
		description: '',
		contentButton: '',
		balance: 0,
		price: 0,
		type: null,
		isDisabled: false,
		handleForTop: false,
		isTapInfinite: false
	});
	const handleTapDailyBoost = async (isTapInfinite: boolean | undefined) => {
		if (typeof isTapInfinite === 'undefined' || timeLeft > 0) return;
		try {
			setIsLoadingFullEnergy(true);
			if (isTapInfinite) {
				dispatch(reset());
				navigate('/tap', { replace: true });
			} else {
				await handleEnergyRefill();
				navigate('/tap', { replace: true });
			}
		} catch (e) {
			console.log(e);
		} finally {
			setIsShowModal(false);
		}
	};
	const handleTapBooster = async (type: IExistOrNo) => {
		if (type !== null && typeof type !== 'undefined' && !isShowModalForDaily) {
			try {
				const response = await handleBoost(type);
				const success = get(response, 'data.success', {});
				if (success) {
					getMeInfo();
				}
			} catch (e) {
				console.log('handleClickButtonModal', e);
			}
		}
	};

	const checkTxStatus = async (time: string) => {
		try {
			const res = await getTxDepositStatus(time);
			if (get(res, 'data.success', false)) {
				setChecking(false);
				setMessage(get(res, 'data.message', ''));
				setIsSuccess(get(res, 'data.data', false));
				localStorage.setItem(`${teleId}${TRY_BUY_BOT}`, '');
				localStorage.setItem(`${teleId}${TIME_BUY_BOT}`, '');
				getMeInfo();
				clearInterval(interval.current);
			}
		} catch (error) {}
	};

	const handleDeposit = async () => {
		try {
			// await setIsShowModal(false);
			const teleId = get(userData, 'telegramId', '');
			if (teleId) {
				const tx = makeTx(teleId, 1);
				setChecking(true);
				const current = Date.now();
				localStorage.setItem(`${teleId}${TIME_BUY_BOT}`, current.toString());
				localStorage.setItem(`${teleId}${TRY_BUY_BOT}`, '1');
				interval.current = setInterval(() => {
					checkTxStatus(current.toString());
				}, 10 * 1000);
				pTimeout(tonConnectUI.sendTransaction(tx), 600000)
					.then(() => {
						// bot.sendMessage(chatId, `Transaction sent successfully`);
					})
					.catch(e => {
						if (e === pTimeoutException) {
							clearInterval(interval.current);
							setChecking(false);
							setIsSuccess(false);
							setMessage('Transaction was not confirmed');
							// bot.sendMessage(chatId, `Transaction was not confirmed`);
							return;
						}

						if (e instanceof UserRejectsError) {
							// bot.sendMessage(chatId, `You rejected the transaction`);
							clearInterval(interval.current);
							setChecking(false);
							setIsSuccess(false);
							setMessage('You rejected the transaction');
							return;
						}
						clearInterval(interval.current);
						setChecking(false);
						setIsSuccess(false);
						setMessage('Unknown error happened');
						// bot.sendMessage(chatId, `Unknown error happened`);
					})
					.finally(() => {
						if (interval.current) {
							clearInterval(interval.current);
						}
						tonConnectUI.connector.pauseConnection();
					});
			} else {
				alert('Please connect your TON wallet');
			}
		} catch (error) {
			alert('Cannot deposit');
		}
	};

	const [isLoadingFullEnergy, setIsLoadingFullEnergy] = useState(false);
	const handleClickButtonModal = async (
		type: IExistOrNo,
		balance: IExistOrNo,
		price: IExistOrNo,
		isDisabled: boolean,
		handleForTop: boolean,
		isTapInfinite?: boolean
	) => {
		if (typeof balance !== 'number' || typeof price !== 'number') return;
		if (balance < price || isDisabled) return;
		if (handleForTop) {
			await handleTapDailyBoost(isTapInfinite);
			setIsLoadingFullEnergy(false);
			return;
		} else {
			await handleTapBooster(type);
			setIsShowModal(false);
		}
	};
	const renderBodyTapping = (props: IPropsBodyModal) => {
		const {
			icon,
			title,
			subtitle,
			description,
			contentButton,
			balance = 0,
			price = 0,
			type,
			isDisabled,
			handleForTop,
			isTapInfinite
		} = props;
		return (
			<div className="flex flex-col items-center gap-6">
				{icon}
				<div className="flex flex-col items-center gap-4">
					<div className="flex flex-col gap-2 items-center">
						<h3 className="text-xl m-0 font-semibold text-white">{title}</h3>
						<span className="element-time text-white">{subtitle}</span>
					</div>

					<p className="m-0 text-[#FFFFFF99] text-sm font-normal text-center">
						{description}
					</p>
				</div>
				{type !== 4 ? (
					isDisabled ? (
						<p className="p-0 m-0 text-white text-base">Insufficient funds</p>
					) : (
						<OkBaseButton
							isDisable={isDisabled}
							isLoading={isLoadingFullEnergy}
							handleOnClick={() =>
								handleClickButtonModal(
									type,
									balance,
									price,
									isDisabled,
									handleForTop,
									isTapInfinite
								)
							}
							rootClass="flex w-full rounded-xl text-base justify-center"
							text={contentButton}
						/>
					)
				) : wallet ? (
					<>
						<TonConnectButton className="ton-connect-page__button" />
						{message === '' ? (
							checking && (
								<p className="m-0 text-[#FFFFFF99] text-sm font-normal text-center">
									Please go to your wallet and confirm transaction. If you
									submitted, please ignore this message. We are verifying.
								</p>
							)
						) : (
							<p
								className="m-0 text-sm font-normal text-center"
								style={{ color: isSuccess ? '#22bb33' : '#bb2124' }}
							>
								{message}
							</p>
						)}
						<OkBaseButton
							isDisable={checking || isSuccess}
							text={'Get it now!'}
							handleOnClick={handleDeposit}
						/>
					</>
				) : (
					<>
						<TonConnectButton className="ton-connect-page__button" />
					</>
				)}
			</div>
		);
	};
	const handleShowModalForDaily = async (
		isHandleTapping: boolean,
		isDisabled: boolean
	) => {
		if (isDisabled || timeLeft > 0) return;
		const total = isHandleTapping
			? infoData?.allowedInfinityTap || 0
			: infoData?.allowedFullEnergyRefill || 0;
		const used = isHandleTapping
			? infoData?.infinityTapUsed || 0
			: infoData?.fullEnergyRefillUsed || 0;
		let textDescription: string;
		const isExist = total - used > 0;
		if (isExist) {
			textDescription = isHandleTapping
				? 'Boost your tap income by x5 for 20 seconds. Energy will not be consumed while Tapping Guru is activated.'
				: 'Maximize your energy recovery.';
		} else {
			textDescription =
				'The number of uses has exceeded the limit for 1 day. Please try on next day.';
		}
		let urlImage: string;
		if (isExist) {
			urlImage = isHandleTapping
				? '/images/icons/fire.svg'
				: '/images/icons/lightning.svg';
		} else {
			urlImage = isHandleTapping
				? '/images/fire_2_disable.png'
				: '/images/icons/lightning_disable.svg';
		}
		const textButton = isExist ? 'Use it now' : 'Got it';
		setIsShowModalForDaily(true);
		await setContentModal({
			icon: <img width={33} height={43} src={urlImage} alt="icon-fire" />,
			title: isHandleTapping ? 'Infinite Tapping' : 'Full Energy',
			subtitle: `${total - used} times remaining`,
			description: textDescription,
			contentButton: textButton,
			isDisabled: total - used === 0,
			handleForTop: true,
			isTapInfinite: isHandleTapping
		});
		setIsShowModal(true);
	};
	const handleClickItemBooster = async (values: any) => {
		setIsShowModalForDaily(false);
		const { src, boostName, price, description, nextLevel, type, status } =
			values;
		await setContentModal({
			icon: (
				<div
					className="w-[56px]"
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<img width={33} height={43} src={src} alt="icon-fire" />
				</div>
			),
			title: boostName,
			subtitle:
				type === 3 || type === 4
					? status
						? 'Active'
						: 'Inactive'
					: `Level ${nextLevel}`,
			description: description,
			contentButton: (
				<div className="flex flex-row gap-1 items-center justify-center text-white">
					Confirm & pay
					<span className="flex flex-row items-center gap-1">
						<img src="/images/icons/coin.svg" alt="icon-coin" />{' '}
						{formatNumberDownRound(price)}
					</span>
				</div>
			),
			balance: infoData?.balance || 0,
			price: price,
			type: type,
			handleForTop: false,
			isDisabled: (infoData?.balance || 0) < price
		});
		setChecking(false);
		setMessage('');
		setIsSuccess(false);
		setIsShowModal(true);
	};
	return (
		<PrivateLayout>
			<div className="body-page">
				<div className="content-page pt-6 px-4">
					<div className="text-center">
						<h4 className="text-[#FFFFFF99] m-0 text-sm">Your Balance</h4>
						<div className="flex flex-row items-center justify-center gap-3">
							<img
								width={36}
								height={36}
								src="/images/icons/coin.svg"
								alt="icon-coin"
							/>
							<span className="text-[42px] text-white font-semibold">
								{formatNumberDownRound(infoData?.balance)}
							</span>
						</div>
					</div>
					<div className="flex-1 overflow-auto">
						<h4 className="mt-6 mb-[6px] text-white">Daily Boost</h4>
						<div className="flex flex-row justify-between gap-4">
							<div
								onClick={() => handleShowModalForDaily(true, timeLeft > 0)}
								className={`flex flex-col gap-3 items-center item-boost flex-1
    							${timeLeft > 0 ? 'disabled' : ''}`}
							>
								{timeLeft > 0 ? (
									<img src="/images/fire_2_disable.png" alt="icon-fire" />
								) : (
									<img src="/images/icons/fire.svg" alt="icon-fire" />
								)}

								<div className="flex flex-col gap-1 items-center">
									<p className="text-sm m-0 text-white">Infinite Tapping</p>
									<p className="text-xs text-[#FFFFFF99] m-0">
										{(infoData?.allowedFullEnergyRefill || 0) -
											(infoData?.infinityTapUsed || 0)}
										/{infoData?.allowedFullEnergyRefill || 0}
									</p>
								</div>
							</div>
							<div
								onClick={() => handleShowModalForDaily(false, timeLeft > 0)}
								className={`flex flex-col gap-3 items-center item-boost flex-1 ${
									timeLeft > 0 ? 'disabled' : ''
								}`}
							>
								{timeLeft > 0 ? (
									<img
										width={33}
										height={43}
										src="/images/icons/lightning_disable.svg"
										alt="icon-fire"
									/>
								) : (
									<img
										width={33}
										height={43}
										src="/images/icons/lightning.svg"
										alt="icon-fire"
									/>
								)}
								<div className="flex flex-col gap-1 items-center">
									<p className="text-sm m-0 text-white">Full Energy</p>
									<p className="text-xs text-[#FFFFFF99] m-0">
										{(infoData?.allowedFullEnergyRefill || 0) -
											(infoData?.fullEnergyRefillUsed || 0)}
										/{infoData?.allowedFullEnergyRefill || 0}
									</p>
								</div>
							</div>
						</div>
						<h4 className="mt-4 mb-[6px] text-white">Booster</h4>
						<div className="flex flex-col gap-3">
							{data.map((item: any, index: number) => (
								<ItemBooster
									type={item.type}
									isCompleted={
										item?.type === 3
											? !!item?.status
											: item?.type === 4
											? item?.status
											: item.remaining === 0
									}
									key={`${index}-item-boost`}
									leftIcon={
										<img
											className="w-full"
											src={item?.src}
											alt="light-booster-icon"
										/>
									}
									name={item?.boostName}
									price={item?.price}
									onClickItem={() => handleClickItemBooster(item)}
									remaining={
										item?.type === 3 ? (item?.status ? 0 : 1) : item?.remaining
									}
								/>
							))}
						</div>
					</div>

					<OkModal
						isOpen={isShowModal}
						setIsOpen={setIsShowModal}
						renderBody={renderBodyTapping(contentModal)}
					/>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default OkBoost;
