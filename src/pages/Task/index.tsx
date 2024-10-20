import { Fragment, useEffect, useState } from 'react';
import './index.scss';
import ItemTask, { IItemTask } from '@/pages/Task/Component/ItemTask';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OkBaseButton from '@/components/Button';
import { useUser } from '@/contexts/UserContext';
import { formatNumberDownRound } from '@/helpers';
import { get } from 'lodash';
import { handleFinishTask } from '@/services';
import { PrivateLayout } from '@/components/PrivateLayout';
import { toast } from 'react-toastify';
import { SOCIAL_CATEGORY } from '@/constants';
import { NoItem } from './Component/NoItem';
import { LineItemOther, LineItemSocial } from './Component/LineItemTask';

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
					<h3 className="mt-0 mb-[6px] text-white">Task list</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataTask.length > 0 ? (
							dataTask.map((item, index) => (
								<LineItemOther
									iconKey={'farming'}
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
					<h3 className="mt-0 mb-[6px] mt-[6px] text-white">Youtube</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
							.length > 0 ? (
							dataSocial
								.filter(item => item.subCategory === SOCIAL_CATEGORY.Y)
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
					<h3 className="mt-0 mb-[12px] mt-[6px] text-white">Telegram</h3>
					<div className="flex flex-col gap-3 z-1">
						{dataSocial.filter(item => item.subCategory === SOCIAL_CATEGORY.T)
							.length > 0 ? (
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
			key: '2',
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
									<LineItemOther
										iconKey={'friend'}
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
		},
		{
			label: 'Ranking',
			key: '3',
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
									<LineItemOther
										iconKey={'ranking'}
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
		</PrivateLayout>
	);
};
export default Task;
