import { Fragment, useEffect, useState } from 'react';
import './index.scss';
import ItemTask, { IItemTask } from '@/pages/Task/Component/ItemTask';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OkBaseButton from '@/components/Button';
import { useUser } from '@/contexts/UserContext';
import { formatNumberDownRound, storeLocalStorage } from '@/helpers';
import { cloneDeep, findIndex, get } from 'lodash';
import { handleFinishTask, handleGetListFriends } from '@/services';
import { PrivateLayout } from '@/components/PrivateLayout';
import { toast } from 'react-toastify';
import {
	APP_SOCIAL_TASK_KEY,
	APP_TASK_KEY,
	FARM_CATEGORY,
	FIVE_MINUTES,
	SOCIAL_CATEGORY
} from '@/constants';
import { NoItem } from './Component/NoItem';
import { LineItemOther, LineItemSocial } from './Component/LineItemTask';
import { motion } from 'framer-motion';
import Friends from '../Friend/Component/Friends';
import InviteFriend from '../Friend/Component/InviteFriend';
import BigNumber from 'bignumber.js';

const tabVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: 20 }
};

const Task = () => {
	const { myTask, userData, getMeInfo } = useUser();
	const [getParam, setParam] = useSearchParams();
	const teleId = get(userData, 'telegramId', '');
	const keyDefault = getParam.get('active-key');
	const [keyActive, setKeyActive] = useState<string>(
		keyDefault === null ? '1' : keyDefault
	);
	// const [dataTask, setDataList] = useState<IItemTask[]>([]);
	const [dataSocial, setDataSocial] = useState<IItemTask[]>([]);
	const [dataTempSocial, setDataTempSocial] = useState<IItemTask[]>([]);
	const [dataRanking, setDataRanking] = useState<IItemTask[]>([]);
	const [dataTempRanking, setDataTempRanking] = useState<IItemTask[]>([]);
	const [dataRef, setDataRef] = useState<IItemTask[]>([]);
	const [totalBal, setTotalBal] = useState(0);
	const [loading, setLoading] = useState('');
	const [loading2, setLoading2] = useState('');
	const [friends, setFriends] = useState<any>([]);

	const getListFriend = async () => {
		try {
			const response = await handleGetListFriends();
			if (get(response, 'data.success', false)) {
				setFriends(get(response, 'data.data', []));
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getListFriend();
	}, []);
	const handleClaimRankingOrRef = async (
		itemRanking: IItemTask,
		isRanking: boolean
	) => {
		// if (!itemRanking.isCompleted || itemRanking.isClaimed) return;
		setLoading2(itemRanking.taskId);
		try {
			const res = await handleFinishTask({ taskId: itemRanking.taskId });
			if (get(res, 'data.success', false)) {
				toast.success('Claim successfully!');
				if (isRanking) {
					setDataTempRanking(prevState =>
						prevState.map(item => ({
							...item,
							isClaimed:
								item.taskId === itemRanking.taskId ? true : item.isClaimed
						}))
					);
				} else {
					setDataRef(prevState => {
						return prevState.map(item => {
							return {
								...item,
								isClaimed:
									item.taskId === itemRanking.taskId ? true : item.isClaimed
							};
						});
					});
				}
			} else {
				toast.error(get(res, 'data.message', 'Claim failed!'));
			}
			setLoading2('');
		} catch (e) {
			console.log(e);
			toast.error('Claim failed!');
			setLoading2('');
		}
	};

	const initSocialData = () => {
		const tempStr = localStorage.getItem(`${teleId}${APP_SOCIAL_TASK_KEY}`);
		if (tempStr) {
			const temp = JSON.parse(tempStr);
			const tempSocialTask = dataSocial.map(item => {
				const clickTime = temp[item.taskId] ?? Number.MAX_VALUE;
				let status = 'Start';
				if (item?.isCompleted) {
					status = 'Done';
				} else if (
					!item?.isCompleted &&
					new BigNumber(clickTime + 1000).lte(Date.now())
				) {
					status = 'Claim';
				}
				return { ...item, status: status };
			});
			setDataTempSocial(tempSocialTask);
		} else {
			setDataTempSocial(dataSocial);
		}
	};

	const initRankingData = () => {
		const tempStr = localStorage.getItem(`${teleId}${APP_SOCIAL_TASK_KEY}`);
		if (tempStr) {
			const temp = JSON.parse(tempStr);
			const tempFarmingTask = dataRanking.map(item => {
				const clickTime = temp[item.taskId] ?? Number.MAX_VALUE;
				let status = 'Start';
				if (item?.isCompleted) {
					status = 'Done';
				} else if (
					!item?.isCompleted &&
					new BigNumber(clickTime + 1000).lte(Date.now())
				) {
					status = 'Claim';
				}
				return { ...item, status: status };
			});
			setDataTempRanking(tempFarmingTask);
		} else {
			setDataTempRanking(dataRanking);
		}
	};

	useEffect(() => {
		if (dataSocial) {
			initSocialData();
		}
	}, [dataSocial]);

	useEffect(() => {
		if (dataRanking) {
			initRankingData();
		}
	}, [dataRanking]);

	const handleClickSocialTask = async (
		task: IItemTask,
		event: React.MouseEvent
	) => {
		try {
			event.stopPropagation();
			if (task.status === 'Start' || task.status === undefined) {
				if (!task?.isCompleted) {
					let temp: any = {};
					const tempStr = localStorage.getItem(
						`${teleId}${APP_SOCIAL_TASK_KEY}`
					);
					if (tempStr) {
						temp = JSON.parse(tempStr);
						if (!temp[task.taskId]) {
							temp[task.taskId] = Date.now();
						}
					} else {
						temp[task.taskId] = Date.now();
					}
					storeLocalStorage(`${teleId}${APP_SOCIAL_TASK_KEY}`, temp);
				}
				setLoading(task.taskId);
				// make a set timeout to change status to claimable
				setTimeout(() => {
					setLoading('');
					initSocialData();
					initRankingData();
				}, 5000);
				const url =
					task?.url?.startsWith('http') || task?.url?.length === 0
						? task?.url
						: `https://t.me/${task?.url?.slice(1)}`;
				window.open(url);
			} else if (task.status === 'Claim') {
				setLoading(task.taskId);
				const response = await handleFinishTask({
					taskId: task.taskId as string,
					code: ''
				});
				const status = get(response, 'data.success', false);
				getMeInfo();
				await new Promise(resolve => setTimeout(resolve, 2000));
				if (!status) {
					toast.error(get(response, 'data.message', ''));
					return;
				}
				toast('Claim successfully!');
				setLoading('');
			}
		} catch (error) {
			console.log('1');
		}
	};

	const handleNavigateTask = (task: IItemTask) => {
		const tempStr = localStorage.getItem(`${teleId}${APP_SOCIAL_TASK_KEY}`);
		if (tempStr) {
			let temp = JSON.parse(tempStr);
			if (!temp[task.taskId]) {
				temp[task.taskId] = Date.now();
			}
			storeLocalStorage(`${teleId}${APP_SOCIAL_TASK_KEY}`, temp);
		}
		const url =
			task?.url?.startsWith('http') || task?.url?.length === 0
				? task?.url
				: `https://t.me/${task?.url?.slice(1)}`;
		window.open(url);
		// window.location.href = url;
		// Telegram.WebApp.openLink('https://example.com');
		//@ts-ignore
		// Telegram.WebApp.openLink(url);
	};

	const items = [
		{
			label: 'Social',
			key: '1',
			hasDot: false,
			render: (
				<div style={{ flex: 1, paddingBottom: 60 }}>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">X</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempSocial.filter(
							item => item.subCategory === SOCIAL_CATEGORY.X
						).length > 0 ? (
							dataTempSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.X)
								.map((item, index) => (
									<LineItemSocial
										handleClick={(e: any) => handleClickSocialTask(item, e)}
										key={`${index}-${item.title}`}
										data={item}
										status={item.taskId === loading ? 'Loading' : item.status}
										// handleNavigate={() => handleNavigateTask(item)}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Discord</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempSocial.filter(
							item => item.subCategory === SOCIAL_CATEGORY.D
						).length > 0 ? (
							dataTempSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.D)
								.map((item, index) => (
									<LineItemSocial
										handleClick={(e: any) => handleClickSocialTask(item, e)}
										handleNavigate={() => handleNavigateTask(item)}
										key={`${index}-${item.title}`}
										data={item}
										status={item.taskId === loading ? 'Loading' : item.status}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Youtube</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempSocial.filter(
							item => item.subCategory === SOCIAL_CATEGORY.Y
						).length > 0 ? (
							dataTempSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
								.map((item, index) => (
									<LineItemSocial
										handleClick={(e: any) => handleClickSocialTask(item, e)}
										handleNavigate={() => handleNavigateTask(item)}
										key={`${index}-${item.title}`}
										data={item}
										status={item.taskId === loading ? 'Loading' : item.status}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[12px] mt-[6px] text-white">Telegram</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempSocial.filter(
							item => item.subCategory === SOCIAL_CATEGORY.T
						).length > 0 ? (
							dataTempSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.T)
								.map((item, index) => (
									<LineItemSocial
										handleClick={(e: any) => handleClickSocialTask(item, e)}
										handleNavigate={() => handleNavigateTask(item)}
										key={`${index}-${item.title}`}
										data={item}
										status={item.taskId === loading ? 'Loading' : item.status}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
				</div>
			)
		},
		{
			label: 'Friend',
			key: '3',
			hasDot: false,
			render: (
				<div style={{ paddingBottom: 60 }}>
					<h3 className="mt-0 mb-[6px] text-white">Task list</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataRef.length > 0 ? (
							dataRef.map((item, index) => {
								const percent =
									// @ts-ignore
									(get(item, 'userValue', 0) * 100) / get(item, 'taskValue', 1);
								const temp = {
									...item,
									percent: percent > 100 ? 100 : percent
								};
								return (
									<LineItemOther
										iconKey={'friend'}
										key={`${index}-${item.title}`}
										data={temp}
										showStep={true}
										handleClick={() => handleClaimRankingOrRef(temp, false)}
										taskValue={''}
										loading={item.taskId === loading2 ? true : false}
									/>
								);
							})
						) : (
							<NoItem />
						)}
					</div>
				</div>
			)
		},
		{
			label: 'Farming',
			key: '2',
			hasDot: false,
			render: (
				<div style={{ paddingBottom: 60 }}>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Farming</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempRanking.filter(
							item => item.subCategory === FARM_CATEGORY.Farm
						).length > 0 ? (
							dataTempRanking
								.filter(item => item.subCategory === FARM_CATEGORY.Farm)
								.map((item, index) => {
									const percent =
										// @ts-ignore
										(get(item, 'userValue', 0) * 100) /
										// @ts-ignore
										get(item, 'taskValue', 1);
									const temp = {
										...item,
										percent: percent > 100 ? 100 : percent
									};
									return (
										<LineItemOther
											iconKey={'farming'}
											showStep={false}
											isDifferent={true}
											key={`${index}-${item.title}`}
											data={temp}
											taskValue={''}
											handleClick={() => handleClaimRankingOrRef(temp, true)}
											loading={item.taskId === loading2 ? true : false}
											// taskValue={item.taskValue ?? 0}
										/>
									);
								})
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Diligence</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempRanking.filter(
							item => item.subCategory === FARM_CATEGORY.Diligence
						).length > 0 ? (
							dataTempRanking
								.filter(item => item.subCategory === FARM_CATEGORY.Diligence)
								.map((item, index) => {
									const percent =
										// @ts-ignore
										(get(item, 'userValue', 0) * 100) /
										// @ts-ignore
										get(item, 'taskValue', 1);
									const temp = {
										...item,
										percent: percent > 100 ? 100 : percent
									};
									return (
										<LineItemOther
											iconKey={'farming'}
											showStep={false}
											isDifferent={true}
											key={`${index}-${item.title}`}
											data={temp}
											taskValue={''}
											handleClick={() => handleClaimRankingOrRef(temp, true)}
											hideProgress={true}
											loading={item.taskId === loading2 ? true : false}
										/>
									);
								})
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Play game</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempRanking.filter(
							item => item.subCategory === FARM_CATEGORY.Play
						).length > 0 ? (
							dataTempRanking
								.filter(item => item.subCategory === FARM_CATEGORY.Play)
								.map((item, index) => {
									return (
										<LineItemSocial
											handleClick={(e: any) => handleClickSocialTask(item, e)}
											key={`${index}-${item.title}`}
											data={{
												...item,
												leftIcon: (
													<img
														src={`/images/icons/task-farming.svg`}
														alt="play-video"
													/>
												)
											}}
											status={item.taskId === loading ? 'Loading' : item.status}
											handleNavigate={() => handleNavigateTask(item)}
										/>
									);
								})
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Vote</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempRanking.filter(
							item => item.subCategory === FARM_CATEGORY.Play
						).length > 0 ? (
							dataTempRanking
								.filter(item => item.subCategory === FARM_CATEGORY.Vote)
								.map((item, index) => {
									return (
										<LineItemSocial
											handleClick={(e: any) => handleClickSocialTask(item, e)}
											key={`${index}-${item.title}`}
											data={{
												...item,
												leftIcon: (
													<img
														src={`/images/icons/task-farming.svg`}
														alt="play-video"
													/>
												)
											}}
											status={item.taskId === loading ? 'Loading' : item.status}
											handleNavigate={() => handleNavigateTask(item)}
										/>
									);
								})
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Upgrade</h3>
					<div
						className="flex flex-col gap-3 z-1"
						style={{ paddingBottom: '20px' }}
					>
						{dataTempRanking.filter(
							item => item.subCategory === FARM_CATEGORY.Upgrade
						).length > 0 ? (
							dataTempRanking
								.filter(item => item.subCategory === FARM_CATEGORY.Upgrade)
								.map((item, index) => {
									return (
										<LineItemOther
											iconKey={'farming'}
											showStep={false}
											isDifferent={true}
											key={`${index}-${item.title}`}
											data={item}
											taskValue={''}
											handleClick={() => handleClaimRankingOrRef(item, true)}
											hideProgress={true}
											loading={item.taskId === loading2 ? true : false}
										/>
									);
								})
						) : (
							<NoItem />
						)}
					</div>
				</div>
			)
		},
		{
			label: 'Invites',
			key: '4',
			hasDot: false,
			render: (
				<div className="flex flex-col gap-4" style={{ paddingBottom: 56 }}>
					{/* <motion.div
						key="friends"
						variants={tabVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={{ duration: 0.5 }}
						className="flex flex-col gap-4"
						style={{ paddingBottom: 56 }}
					> */}
					<Friends items={friends} />
					{/* </motion.div> */}
				</div>
			)
		}
	];

	const makeTaskData = async (myTask: any[]) => {
		try {
			// setDataList(
			// 	myTask
			// 		.filter((item: any) => item.category === 0)
			// 		.map((item: any) => ({
			// 			...item,
			// 			leftIcon: (
			// 				<img src="/images/icons/play-video.svg" alt="play-video" />
			// 			),
			// 			type: 'coin'
			// 		}))
			// );
			setDataSocial(
				myTask
					.filter((item: any) => item.category === 1)
					.map((item: any) => ({
						...item,
						leftIcon: (
							<img
								src={`${get(
									item,
									'imageUrl',
									'https://app.sportshero.club/images/game/vertus.webp'
								)}?v=1`}
								width={55}
								height={55}
								style={{ borderRadius: 30 }}
								alt="task-icon"
							/>
						),
						type: 'coin'
					}))
			);
			setDataRanking(
				myTask
					.filter((item: any) => item.category === 2)
					.map((item: any) => ({
						...item,
						leftIcon: (
							<img
								width={40}
								height={40}
								src={`/images/trophy/${item?.title?.toLowerCase()}.png`}
								alt="trophy-icon"
							/>
						),
						type: 'progress',
						rightElement: <OkBaseButton rootClass="p-3" text={'Claim'} />
					}))
			);
			setDataRef(
				myTask
					.filter((item: any) => item.category === 3)
					.map((item: any) => ({
						...item,
						leftIcon: <img src="/images/icons/fb.svg" alt="task-icon" />,
						type: 'progress',
						rightElement: (
							<OkBaseButton rootClass="p-3" text={'Claim'} isDisable={false} />
						)
					}))
			);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (myTask) {
			makeTaskData(myTask);
		}
	}, [myTask]);
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setCountRender(prevState => ++prevState);
	// 	}, 500);
	// }, [keyActive]);

	useEffect(() => {
		if (myTask) {
			const temp = myTask.filter((item: any) => {
				return item?.category?.toString() === keyActive?.toString();
			});
			setTotalBal(get(temp, `[0].userValue`, 0));
		}
	}, [myTask, keyActive]);
	const handleChangeTab = (item: any) => {
		setKeyActive(item.key);
		setParam(`active-key=${item.key}`, { replace: true });
	};
	return (
		<PrivateLayout>
			<div className="body-page">
				<div className="content-page pt-6 px-4">
					<div>
						<div className="text-center">
							<h4 className="text-[#FEFFFF99] m-0 text-[14px]">
								Your Current Achievement
							</h4>
							<div className="flex flex-row items-center justify-center gap-3">
								<img
									width={28}
									height={28}
									src="/images/icons/coin.svg"
									alt="icon-coin"
								/>
								<span className="text-[36px] text-white font-semibold">
									{formatNumberDownRound(totalBal)}
								</span>
							</div>
						</div>
						<div className="tab-menu">
							<ul className="list-none p-0 flex flex-row justify-between items-center">
								{items.map(item => (
									<li
										onClick={() => handleChangeTab(item)}
										key={item.key}
										className={`${
											item.key === keyActive ? 'tab-active' : ''
										} item-tap`}
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
					</div>

					<div className="content-tab overflow-y-auto flex-1">
						{items.find(item => item.key === keyActive)?.render}
					</div>
				</div>
			</div>
			{keyActive === '4' && (
				<div
					className="flex-none"
					style={{
						paddingLeft: 16,
						paddingRight: 16,
						paddingTop: 16
					}}
				>
					<InviteFriend />
				</div>
			)}
		</PrivateLayout>
	);
};
export default Task;
