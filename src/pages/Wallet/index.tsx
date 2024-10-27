import { useEffect, useState } from 'react';
import './index.scss';
import { get } from 'lodash';
import {
	handleGetStatistic,
	IWithdrawItem,
	makeCommissionTx
} from '@/services';
import { formatNumberDownRound, minimizeAddress } from '@/helpers';
import { PrivateLayout } from '@/components/PrivateLayout';
import { useUser } from '@/contexts/UserContext';
import { config } from '@/config';
import BigNumber from 'bignumber.js';
import {
	TonConnectButton,
	UserRejectsError,
	useTonConnectUI,
	useTonWallet
} from '@tonconnect/ui-react';
import OKButton from '@/components/Button';
import {
	fetchListWithdrawRequest,
	fetchUserListWithdrawRequest,
	makeWithdrawRequest
} from '@/services/auth';
import { toast } from 'react-toastify';
import OkModal from '@/components/Modal';
import { pTimeout, pTimeoutException } from '@/utils';
import { useSearchParams } from 'react-router-dom';
import WithdrawalItem from './component/WithdrawalItem';
import { NoItem } from '../Task/Component/NoItem';
export interface IItemWallet {
	title: string;
	countTouch: string;
}

const WithdrawStatus = {
	Pending: 'Pending',
	Success: 'Success',
	Fail: 'Fail'
};

export interface IWithdrawResponseItem {
	telegramId: string;
	amount: number;
	address: string;
	createdAt: string;
	status: string;
	firstName: string;
	lastName: string;
}

const OkWallet = () => {
	const [tonConnectUI, setOptions] = useTonConnectUI();
	const { userData } = useUser();
	const wallet = useTonWallet();
	const [isShowModal, setIsShowModal] = useState<boolean>(false);
	const [listPendingWithdraw, setListPendingWithdraw] = useState<
		IWithdrawResponseItem[]
	>([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [userPendingListWithdraw, setPendingUserListWithdraw] = useState<
		IWithdrawResponseItem[]
	>([]);
	const [userHistoryListWithdraw, setUserHistoryListWithdraw] = useState<
		IWithdrawResponseItem[]
	>([]);
	const [dataWallet, setDataWallet] = useState<IItemWallet[]>([
		{ title: 'Total Points', countTouch: '-' },
		{ title: 'Total Players', countTouch: '-' },
		{ title: 'Daily Users', countTouch: '-' },
		{ title: 'Online Players', countTouch: '-' }
	]);
	const [getParam, setParam] = useSearchParams();
	const keyDefault = getParam.get('active-key');
	const [keyActive, setKeyActive] = useState<string>(
		keyDefault === null ? '1' : keyDefault
	);
	const [totalShare, setTotalShare] = useState<number>(0);
	const getInfoWallet = async () => {
		try {
			const response = await handleGetStatistic();
			const data: {
				totalSharedBalance: number;
				totalTouch: number;
				totalUsers: number;
				dailyUsers: number;
				onlineUsers: number;
			} = get(response, 'data.data', {});
			setTotalShare(data.totalSharedBalance);
			setDataWallet(prevState => {
				return prevState.map(item => {
					switch (item.title) {
						case 'Total Points':
							return {
								...item,
								countTouch:
									data.totalTouch < 0
										? '0'
										: formatNumberDownRound(data.totalTouch).toString()
							};
						case 'Total Players':
							return {
								...item,
								countTouch:
									data.totalUsers < 0
										? '0'
										: formatNumberDownRound(data.totalUsers).toString()
							};
						case 'Daily Users':
							return {
								...item,
								countTouch:
									data.dailyUsers < 0
										? '0'
										: formatNumberDownRound(data.dailyUsers).toString()
							};
						case 'Online Players':
							return {
								...item,
								countTouch:
									data.onlineUsers < 0
										? '0'
										: formatNumberDownRound(data.onlineUsers).toString()
							};
						default:
							return { ...item };
					}
				});
			});
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		getInfoWallet();
		getUserListWithdrawRequest();
	}, []);

	useEffect(() => {
		if (keyActive == '1') {
			getInfoWallet();
		} else if (keyActive == '2') {
			getUserListWithdrawRequest();
		} else if (keyActive == '3') {
			getListPendingWithdrawRequest();
		}
	}, [keyActive]);

	useEffect(() => {
		setTimeout(() => {
			getInfoWallet();
		}, 1000);
	}, []);

	const getListPendingWithdrawRequest = async () => {
		try {
			const res = await fetchListWithdrawRequest('pending');
			console.log('getListPendingWithdrawRequest===', res);
			if (get(res, 'data.success', false)) {
				const temp = get(res, 'data.data', []);
				const tempAmount = temp.reduce(
					(sum: number, item: IWithdrawResponseItem) => sum + item.amount,
					0
				);
				setTotalAmount(tempAmount);
				setListPendingWithdraw(temp);
			}
		} catch (error) {}
	};

	const getUserListWithdrawRequest = async () => {
		try {
			const res = await fetchUserListWithdrawRequest();
			console.log('getUserListWithdrawRequest===', res);
			if (get(res, 'data.success', false)) {
				const temp: IWithdrawResponseItem[] = get(res, 'data.data', []);
				setPendingUserListWithdraw(
					temp.filter(
						(item: IWithdrawResponseItem) =>
							item.status === WithdrawStatus.Pending
					)
				);
				setUserHistoryListWithdraw(
					temp.filter(
						(item: IWithdrawResponseItem) =>
							item.status !== WithdrawStatus.Pending
					)
				);
			}
		} catch (error) {}
	};

	const handleMakeWithdraw = async () => {
		try {
			const withdrawBody = {
				amount: get(userData, 'tonBalance', 0),
				note: userData?.telegramId
			};
			const res = await makeWithdrawRequest(withdrawBody);
			console.log('handleMakeWithdraw====', res);
			if (get(res, 'data.success', false)) {
				toast.success('Make withdrawal request successfully!');
				getUserListWithdrawRequest();
			} else {
				toast.error(
					get(res, 'data.message', 'Make withdrawal request successfully!')
				);
			}
		} catch (error) {
			toast.error('Oops! Something wrong happended!');
		} finally {
			setIsShowModal(false);
		}
	};

	const handlePayCommission = async () => {
		try {
			const res = await fetchListWithdrawRequest('pending');
			if (get(res, 'data.success', false)) {
				const listRequest = get(res, 'data.data', []);
				if (listRequest.length > 0) {
					const tx = makeCommissionTx(listRequest);
					console.log('tx', tx);
					pTimeout(tonConnectUI.sendTransaction(tx), 600000)
						.then(() => {
							// bot.sendMessage(chatId, `Transaction sent successfully`);
						})
						.catch(e => {
							if (e === pTimeoutException) {
								return;
							}

							if (e instanceof UserRejectsError) {
								return;
							}
						})
						.finally(() => {
							tonConnectUI.connector.pauseConnection();
						});
				} else {
					toast.warning('No withdrawal request existed.');
				}
			} else {
				toast.error('Fail to get list withdrawal request.');
			}
		} catch (error) {
			toast.error('Fail to get list withdrawal request.');
		}
	};

	const renderBodyTapping = () => {
		const addressJson = get(userData, 'receiveAddress', '');
		let address = '';
		if (addressJson.length > 0) {
			address =
				import.meta.env.VITE_ENV === 'Testnet'
					? JSON.parse(addressJson).TestNet
					: JSON.parse(addressJson).MainNet;
		}
		return (
			<div className="flex flex-col items-center gap-6">
				<div className="flex flex-col items-center gap-4">
					<div className="flex flex-col gap-2 items-center">
						<h3 className="text-xl m-0 font-semibold text-white">
							Withdraw confirmation?
						</h3>
					</div>

					<p className="m-0 text-[#FEFFFF99] text-sm font-normal text-center">
						Are you sure you want to withdraw{' '}
						{formatNumberDownRound(
							new BigNumber(get(userData, 'tonBalance', 0))
								.dividedBy(10 ** 9)
								.toNumber(),
							9
						)}{' '}
						TON to your deposit wallet?
						<br />
						{address && (
							<a
								href={`${import.meta.env.VITE_TON_SCAN}/${address}`}
								target="_blank"
							>
								{minimizeAddress(address, 12)}
							</a>
						)}
					</p>
				</div>
				<OKButton
					handleOnClick={handleMakeWithdraw}
					rootClass="flex-1 w-full primary-button mt-4"
					style={{ borderRadius: 40 }}
					text={'Confirm'}
				/>
			</div>
		);
	};

	const handleChangeTab = (item: any) => {
		setKeyActive(item.key);
		setParam(`active-key=${item.key}`, { replace: true });
	};

	const items = [
		{
			label: 'Overview',
			key: '1',
			visible: true,
			hasDot: false,
			render: (
				<div className="flex-1">
					<div className="overflow-auto">
						<div
							className="text-center pb-2"
							style={{ borderBottom: '1px solid #1E293B' }}
						>
							<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
								Total Share Balance
							</h4>
							<div className="flex flex-row items-center justify-center gap-3">
								<img
									width={36}
									height={36}
									src="/images/icons/coin.svg"
									alt="icon-coin"
								/>
								<h1 className="text-[42px] m-0 text-white font-semibold">
									{formatNumberDownRound(totalShare)}
								</h1>
							</div>
						</div>
						<div className="flex flex-col flex-1 gap-4">
							{dataWallet.map((item, index) => (
								<div
									key={index}
									className="flex flex-col gap-2 items-center item-wallet bg-card"
								>
									<p className="m-0 truncate text-[#FFFFFF99] text-xs font-medium">
										{item.title}
									</p>
									<span className="text-[28px] text-white font-semibold">
										{item.countTouch}
									</span>
								</div>
							))}

							<div className="flex flex-col justify-center items-center gap-2 min-h-[103px]">
								<p className="p-0 m-0 text-sm text-[#FEFFFF99]">
									Join our community
								</p>
								<div className="flex flex-row gap-1 justify-center items-center">
									<a href={import.meta.env.VITE_TELE_CHANNEL_LINK}>
										<img
											src="/images/icons/social/telegram.svg"
											alt="telegram-icon"
										/>
									</a>
									<a href={import.meta.env.VITE_YOUTUBE_LINK}>
										<img
											src="/images/icons/social/youtube.svg"
											alt="youtube-icon"
										/>
									</a>

									<a href={import.meta.env.VITE_X_LINK}>
										<img src="/images/icons/social/x.svg" alt="x-icon" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		},
		{
			label: 'Withdraw',
			key: '2',
			visible: true,
			hasDot: false,
			render: (
				<div className="flex-1 ">
					<div
						className="flex-1 text-center"
						style={{ borderBottom: '1px solid #1E293B', overflow: 'visible' }}
					>
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Your TON Commission
						</h4>
						<div className="flex flex-row items-center justify-center gap-3">
							<img
								width={32}
								height={32}
								src="/images/icons/ton-logo.svg"
								alt="icon-coin"
							/>
							<h1 className="text-[42px] m-0 text-white font-semibold">
								{formatNumberDownRound(
									new BigNumber(get(userData, 'tonBalance', 0))
										.dividedBy(10 ** 9)
										.toNumber(),
									9
								)}
							</h1>
						</div>
						<p className="m-0 text-[#FFCE31] text-xs mt-4">
							You just can make <b>ONE</b> withdrawal request at a time, and
							minimum amount is 1 TON
						</p>
						<div className="flex flex-row gap-1 justify-center items-center">
							<OKButton
								isDisable={
									new BigNumber(get(userData, 'tonBalance', 0)).toNumber() <
										10 ** 9 || userPendingListWithdraw.length > 0
								}
								handleOnClick={() => {
									if (userData?.receiveAddress == '') {
										toast.error(
											'You need make a deposit (for example buying AI bot) before making a withdrawal request.'
										);
										return;
									}
									setIsShowModal(true);
								}}
								rootClass="flex-1 w-full primary-button mt-4"
								style={{ borderRadius: 40 }}
								text={'Withdraw'}
							/>
						</div>
					</div>

					<div className="overflow-auto mt-3">
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Current request
						</h4>
						<div className="gap-1">
							{userPendingListWithdraw.length > 0 ? (
								userPendingListWithdraw.map(
									(item: IWithdrawResponseItem, index: number) => {
										const address =
											import.meta.env.VITE_ENV === 'Testnet'
												? JSON.parse(item.address).TestNet
												: JSON.parse(item.address).MainNet;
										return (
											<WithdrawalItem
												key={index + 'myDoneRequest'}
												address={address}
												status={item.status}
												amount={formatNumberDownRound(
													new BigNumber(get(item, 'amount', 0))
														.dividedBy(10 ** 9)
														.toNumber(),
													9
												)}
												name={item.telegramId}
											/>
										);
									}
								)
							) : (
								<NoItem msg="No data yet" />
							)}
						</div>
					</div>
					<div className="overflow-auto mt-3">
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Withdrawal history
						</h4>
						<div>
							{userHistoryListWithdraw.length > 0 ? (
								userHistoryListWithdraw.map(
									(item: IWithdrawResponseItem, index: number) => {
										const address =
											import.meta.env.VITE_ENV === 'Testnet'
												? JSON.parse(item.address).TestNet
												: JSON.parse(item.address).MainNet;
										return (
											<WithdrawalItem
												key={index + 'myDoneRequest'}
												address={address}
												status={item.status}
												amount={formatNumberDownRound(
													new BigNumber(get(item, 'amount', 0))
														.dividedBy(10 ** 9)
														.toNumber(),
													9
												)}
												name={item.telegramId}
											/>
										);
									}
								)
							) : (
								<NoItem msg="No data yet" />
							)}
						</div>
					</div>
				</div>
			)
		},
		{
			label: 'Commission',
			visible: [459926971].includes(Number(userData?.telegramId)),
			key: '3',
			hasDot: false,
			render: (
				<div className="flex-1">
					<h4 className="text-[#FFFFFF99] m-0 text-[14px] text-center">
						Total withdrawal request
					</h4>
					<div className="flex flex-row items-center justify-center gap-3">
						<img
							width={32}
							height={32}
							src="/images/icons/ton-logo.svg"
							alt="icon-coin"
						/>
						<h1 className="text-[42px] m-0 text-white font-semibold">
							{formatNumberDownRound(
								new BigNumber(totalAmount).dividedBy(10 ** 9).toNumber(),
								9
							)}
						</h1>
					</div>
					{/* <div className="flex-1 text-center"> */}
					<TonConnectButton className="ton-connect-page__button" />
					<OKButton
						isDisable={!wallet}
						handleOnClick={handlePayCommission}
						rootClass="flex-1 w-full primary-button mt-4"
						style={{ borderRadius: 40 }}
						text={'Pay Commission'}
					/>
					{/* </div> */}

					<div className="overflow-auto mt-3">
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Current pending request
						</h4>
						<div className="gap-1">
							{listPendingWithdraw.map(
								(item: IWithdrawResponseItem, index: number) => {
									const address =
										import.meta.env.VITE_ENV === 'Testnet'
											? JSON.parse(item.address).TestNet
											: JSON.parse(item.address).MainNet;
									return (
										<WithdrawalItem
											isDiff={true}
											key={index + 'currentPending'}
											address={address}
											status={item.status}
											amount={formatNumberDownRound(
												new BigNumber(get(item, 'amount', 0))
													.dividedBy(10 ** 9)
													.toNumber(),
												9
											)}
											name={`${item.firstName} ${item.lastName}`}
										/>
									);
								}
							)}
						</div>
					</div>
					{/* <div className="overflow-auto mt-3">
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Commission history
						</h4>
						<div className="gap-1">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
								(item: any, index: number) => {
									return (
										<WithdrawalItem
											key={index + 'commission'}
											address="aaa"
											status="Success"
											amount={1}
											name="Address"
										/>
									);
								}
							)}
						</div>
					</div> */}
				</div>
			)
		}
	];

	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="body-page">
				<div className="content-page pt-6 px-4 gap-4">
					<div className="tab-menu">
						<ul className="list-none p-0 flex flex-row justify-between items-center">
							{items
								.filter((item: any) => item.visible === true)
								.map(item => (
									<li
										onClick={() => handleChangeTab(item)}
										key={item.key}
										className={`${
											item.key === keyActive ? 'tab-active' : ''
										} item-tap`}
										style={{ flex: 1, textAlign: 'center' }}
									>
										<span>
											{item.label}{' '}
											{item.hasDot && item.key !== keyActive && (
												<div className="dot-red"></div>
											)}
										</span>
									</li>
								))}
						</ul>
					</div>
					<div className="content-tab overflow-y-auto flex-1">
						{items.find(item => item.key === keyActive)?.render}
					</div>
				</div>
			</div>
			<OkModal
				isOpen={isShowModal}
				setIsOpen={setIsShowModal}
				renderBody={renderBodyTapping()}
				rootClassname="bg-card"
			/>
		</PrivateLayout>
	);
};
export default OkWallet;
