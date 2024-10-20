import OkBaseButton from '@/components/Button';
import { PrivateLayout } from '@/components/PrivateLayout';
import { SOCIAL_CATEGORY } from '@/constants';
import { useUser } from '@/contexts/UserContext';
import { formatNumberDownRound } from '@/helpers';
import ItemTask, { IItemTask } from '@/pages/Task/Component/ItemTask';
import { handleFinishTask } from '@/services';
import { AnimatePresence, motion } from 'framer-motion';
import { get } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LineItemSocial } from './Component/LineItemTask';
import { NoItem } from './Component/NoItem';
import './index.scss';
import FarmingTab from './Tabs/FarmingTab';
import SocialTab from './Tabs/SocialTab';
import FriendTab from './Tabs/FriendTab';
import RankingTab from './Tabs/RankingTab';

interface TabContentProps {
	content: string | ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ content }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
		>
			{content}
		</motion.div>
	);
};

const Task = () => {
	const { myTask } = useUser();
	const [getParam, setParam] = useSearchParams();
	const keyDefault = getParam.get('active-key');
	const [keyActive, setKeyActive] = useState<string>(
		keyDefault === null ? '0' : keyDefault
	);
	const [dataTask, setDataList] = useState<IItemTask[]>([]);
	const [dataSocial, setDataSocial] = useState<IItemTask[]>([]);
	const [dataRanking, setDataRanking] = useState<IItemTask[]>([]);
	const [dataRef, setDataRef] = useState<IItemTask[]>([]);
	const navigate = useNavigate();
	const [totalBal, setTotalBal] = useState(0);
	const [countRender, setCountRender] = useState(0);
	const handleClaimRankingOrRef = async (
		itemRanking: IItemTask,
		isRanking: boolean
	) => {
		if (!itemRanking.isCompleted) return;
		if (itemRanking.isClaimed) return;
		try {
			await handleFinishTask({ taskId: itemRanking.taskId });
			toast('Claim successfully!');
			if (isRanking) {
				setDataRanking(prevState => {
					return prevState.map(item => {
						return {
							...item,
							isClaimed:
								item.taskId === itemRanking.taskId ? true : item.isClaimed
						};
					});
				});
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
		} catch (e) {
			console.log(e);
		}
	};

	const items = [
		{
			label: 'Farming',
			key: '0',
			hasDot: false,
			render: (
				<>
					<h3 className="mt-0 mb-[6px] text-base font-semibold text-white">
						Task list
					</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataTask.length > 0 ? (
							dataTask.map((item, index) => (
								<ItemTask
									handleNavigate={() => {
										navigate(`/task/detail/${item.taskId}`);
									}}
									key={`${index}-${item.title}`}
									data={item}
								/>
							))
						) : (
							<NoItem />
						)}
					</div>
				</>
			)
		},
		// {
		// 	label: 'Social',
		// 	key: '1',
		// 	hasDot: false,
		// 	render: (
		// 		<>
		// 			<h3 className="mt-0 mb-[6px] mt-[6px] text-white">X</h3>
		// 			<div className="flex flex-col gap-3 z-1">
		// 				{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.X)
		// 					.length > 0 ? (
		// 					dataSocial
		// 						.filter(item => item.subCategory === SOCIAL_CATEGORY.X)
		// 						.map((item, index) => (
		// 							<ItemTask
		// 								handleNavigate={() => {
		// 									navigate(`/task/detail/${item.taskId}`);
		// 								}}
		// 								key={`${index}-${item.title}`}
		// 								data={item}
		// 							/>
		// 						))
		// 				) : (
		// 					<NoItem />
		// 				)}
		// 			</div>
		// 			<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Youtube</h3>
		// 			<div className="flex flex-col gap-3 z-1">
		// 				{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
		// 					.length > 0 ? (
		// 					dataSocial
		// 						.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
		// 						.map((item, index) => (
		// 							<ItemTask
		// 								handleNavigate={() => {
		// 									navigate(`/task/detail/${item.taskId}`);
		// 								}}
		// 								key={`${index}-${item.title}`}
		// 								data={item}
		// 							/>
		// 						))
		// 				) : (
		// 					<NoItem />
		// 				)}
		// 			</div>
		// 			<h3 className="mt-0 mb-[12px] mt-[6px] text-white">Telegram</h3>
		// 			<div className="flex flex-col gap-3 z-1">
		// 				{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.T)
		// 					.length > 0 ? (
		// 					dataSocial
		// 						.filter(item => item.subCategory === SOCIAL_CATEGORY.T)
		// 						.map((item, index) => (
		// 							<ItemTask
		// 								handleNavigate={() => {
		// 									navigate(`/task/detail/${item.taskId}`);
		// 								}}
		// 								key={`${index}-${item.title}`}
		// 								data={item}
		// 							/>
		// 						))
		// 				) : (
		// 					<NoItem />
		// 				)}
		// 			</div>
		// 		</>
		// 	)
		// },
		{
			label: 'Social',
			key: '1',
			hasDot: false,
			render: (
				<>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">X</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.X)
							.length > 0 ? (
							dataSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.X)
								.map((item, index) => (
									<ItemTask
										handleNavigate={() => {
											navigate(`/task/detail/${item.taskId}`);
										}}
										key={`${index}-${item.title}`}
										data={item}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Youtube</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
							.length > 0 ? (
							dataSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
								.map((item, index) => (
									<ItemTask
										handleNavigate={() => {
											navigate(`/task/detail/${item.taskId}`);
										}}
										key={`${index}-${item.title}`}
										data={item}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
					<h3 className="mt-0 mb-[12px] mt-[6px] text-white">Telegram</h3>
					<div className="flex flex-col gap-3 z-1">
						{(dataSocial ?? [{}]).filter(
							item => item.subCategory === SOCIAL_CATEGORY.T
						).length > 0 ? (
							dataSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.T)
								.map((item, index) => (
									<LineItemSocial
										handleNavigate={() => {
											navigate(`/task/detail/${item.taskId}`);
										}}
										key={`${index}-${item.title}`}
										data={item}
									/>
								))
						) : (
							<NoItem />
						)}
					</div>
				</>
			)
		},
		{
			label: 'Friend',
			key: '3',
			hasDot: false,
			render: (
				<>
					<h3 className="mt-0 mb-[6px] text-white">Task list</h3>
					<div className="flex flex-col gap-3 z-1">
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
									<ItemTask
										showStep={false}
										isDifferent={true}
										key={`${index}-${item.title}`}
										data={temp}
										handleClick={() => handleClaimRankingOrRef(temp, false)}
									/>
								);
							})
						) : (
							<NoItem />
						)}
					</div>
				</>
			)
		},
		{
			label: 'Ranking',
			key: '2',
			hasDot: false,
			render: (
				<>
					<h3 className="mt-0 mb-[6px] text-white">Task list</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataRanking.length > 0 ? (
							dataRanking.map((item, index) => {
								const percent =
									// @ts-ignore
									(get(item, 'userValue', 0) * 100) / get(item, 'taskValue', 1);
								const temp = {
									...item,
									percent: percent > 100 ? 100 : percent
								};
								return (
									<ItemTask
										key={`${index}-${item.title}`}
										data={temp}
										showStep={true}
										handleClick={() => handleClaimRankingOrRef(temp, true)}
									/>
								);
							})
						) : (
							<NoItem />
						)}
					</div>
				</>
			)
		}
	];

	const makeTaskData = async (myTask: any[]) => {
		try {
			setDataList(
				myTask
					.filter((item: any) => item.category === 0)
					.map((item: any) => ({
						...item,
						leftIcon: (
							<img src="/images/icons/play-video.svg" alt="play-video" />
						),
						type: 'coin'
					}))
			);
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
	useEffect(() => {
		setTimeout(() => {
			setCountRender(prevState => ++prevState);
		}, 500);
	}, [keyActive]);

	useEffect(() => {
		if (myTask) {
			const temp = myTask.filter((item: any) => {
				return item?.category?.toString() === keyActive?.toString();
			});
			setTotalBal(get(temp, `[0].userValue`, 0));
		}
	}, [myTask, keyActive]);

	const [selectedTab, setSelectedTab] = useState<string>('farming');
	const tabs = ['farming', 'social', 'friend', 'ranking'];

	const getContent = (tab: string) => {
		switch (tab) {
			case 'farming':
				return (
					<FarmingTab
						tasks={[
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							}
						]}
					/>
				);
			case 'social':
				return (
					<SocialTab
						tasks={[
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							}
						]}
					/>
				);
			case 'friend':
				return (
					<FriendTab
						tasks={[
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							}
						]}
					/>
				);
			case 'ranking':
				return (
					<RankingTab
						tasks={[
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							},
							{
								leftIcon: 'x',
								title: 'Farm 20,000 coins',
								reward: 5000000,
								percent: 70
							}
						]}
					/>
				);
			default:
				return '';
		}
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
						<div className="w-full tab-menu">
							<ul className="list-none p-0 flex flex-row justify-between items-center">
								{tabs.map(tab => (
									<li
										key={tab}
										onClick={() => setSelectedTab(tab)}
										className={`cursor-pointer p-2 ${
											selectedTab === tab ? 'tab-active' : ''
										}`}
									>
										{tab.charAt(0).toUpperCase() + tab.slice(1)}
									</li>
								))}
							</ul>
							<AnimatePresence>
								<motion.div key={selectedTab}>
									<TabContent content={getContent(selectedTab)} />
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default Task;
