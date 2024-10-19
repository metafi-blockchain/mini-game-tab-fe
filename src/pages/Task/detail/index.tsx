import '../index.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { handleGetMyTask } from '@/services';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { IItemTask } from '@/pages/Task/Component/ItemTask';
import { formatNumberDownRound, storeLocalStorage } from '@/helpers';
import OKButton from '@/components/Button';
import { handleFinishTask } from '@/services';
import { PrivateLayout } from '@/components/PrivateLayout';
import { toast } from 'react-toastify';
import { APP_TASK_KEY, FIVE_MINUTES } from '@/constants';
import { useUser } from '@/contexts/UserContext';

const OkTaskDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { userData, boostList, getMeInfo } = useUser();
	const teleId = get(userData, 'telegramId', '');
	const [detailTask, setDetailTask] = useState<IItemTask | null>(null);
	const [code, setCode] = useState<string>('');
	const [isLoadingFinishTask, setIsLoadingFinishTask] = useState(false);
	const [messageError, setMessageError] = useState<string | null>(null);
	const [clickTime, setClickTime] = useState(Number.MAX_SAFE_INTEGER);
	const handleChangeCode = (event: any) => {
		setCode(event.target.value);
	};
	const getAllData = async () => {
		try {
			const response = await handleGetMyTask();
			const totalData = get(response, 'data.data', []);
			setDetailTask(totalData.find((item: any) => item.taskId === id));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (detailTask) {
			handleGetClickTimeForTask();
		}
	}, [detailTask]);

	const handleGetClickTimeForTask = () => {
		try {
			if (detailTask?.taskId && !detailTask?.isCompleted) {
				let temp: any = {};
				const tempStr = localStorage.getItem(`${teleId}${APP_TASK_KEY}`);
				if (tempStr) {
					temp = JSON.parse(tempStr);
					if (temp[detailTask?.taskId]) {
						setClickTime(Number(temp[detailTask?.taskId]));
					}
				}
			}
		} catch (error) {}
	};

	useEffect(() => {
		getAllData();
	}, []);
	const handleFinish = async () => {
		if (detailTask?.isCompleted) {
			return;
		}
		try {
			setIsLoadingFinishTask(true);
			const response = await handleFinishTask({
				taskId: id as string,
				code: code
			});

			const status = get(response, 'data.success', false);
			if (!status) {
				toast.error(get(response, 'data.message', ''));
				return;
			}
			toast('Claim successfully!');
			navigate(`/task?active-key=${detailTask?.category}`, { replace: true });
		} catch (e) {
			toast.error('Claim failed!');
			console.log(e, '======error');
		} finally {
			setIsLoadingFinishTask(false);
		}
	};

	const handleClickTask = (taskId: string) => {
		try {
			if (!detailTask?.isCompleted) {
				let temp: any = {};
				const tempStr = localStorage.getItem(`${teleId}${APP_TASK_KEY}`);
				if (tempStr) {
					temp = JSON.parse(tempStr);
					if (!temp[taskId]) {
						temp[taskId] = Date.now();
					}
				} else {
					temp[taskId] = Date.now();
				}
				storeLocalStorage(`${teleId}${APP_TASK_KEY}`, temp);
			}
		} catch (error) {}
	};
	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="overflow-y-scroll">
				<div className="p-4">
					<div className="container-logo text-center">
						<img
							width={'100%'}
							height={200}
							src="/images/bg-task-detail.jpeg"
							alt="logo"
						/>
					</div>
				</div>
				<div className="p-4 pt-0">
					<div className="flex flex-row justify-between item-task items-center">
						<p className="p-0 m-0 text-white">Chance to win so much reward</p>
						<img
							width={30}
							height={30}
							src="/images/icons/logo.svg"
							alt="logo"
						/>
					</div>
				</div>
				<div className="p-4 pb-0">
					<div className="flex flex-row gap-2 items-center">
						<div className="bg-[#1E293B] rounded-xl flex p-2">
							<img
								width={30}
								height={30}
								src="/images/icons/logo.svg"
								alt="logo"
							/>
						</div>
						<p className="m-0 p-0 text-sm text-white">ETERNAL KINGDOMS</p>
					</div>

					<p className="text-xs text-[#FFFFFF99]">
						To remain updated and earn rewards, follow all Eternal Kingdoms
						social media accounts, watch our videos and receive more and more
						reward!
					</p>
				</div>
				<div className="body-page">
					<div className="flex flex-col pt-6 px-4 gap-4">
						<div className="flex flex-col gap-4">
							<h1 className="text-xl m-0 text-white">
								{detailTask?.title || ''}
							</h1>
							<p className="m-0 text-[#FFFFFF99] text-[13px]">
								{detailTask?.description || ''}
							</p>
							<div className="flex flex-row justify-around item-base items-center">
								<div className="flex flex-col gap-1 items-center">
									<span className="text-[#FFFFFF99] text-xs">Reward</span>

									<div className="flex flex-row items-center justify-center gap-3">
										<img
											width={16}
											height={16}
											src="/images/icons/coin.svg"
											alt="icon-coin"
										/>
										<span className="text-sm text-white">
											{formatNumberDownRound(detailTask?.reward || 0)}
										</span>
									</div>
								</div>
								<span className="line-vertical"></span>

								<div className="flex flex-col gap-1 items-center">
									<span className="text-[#FFFFFF99] text-xs">Status</span>
									<div className="flex flex-row items-center justify-center gap-3">
										<span
											className={`${
												detailTask?.isCompleted
													? 'text-[#20EDCD]'
													: 'text-white'
											} text-sm`}
										>
											{detailTask?.isCompleted
												? 'Completed'
												: 'Not started yet'}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<h2 className="text-base m-0 text-white">Your task</h2>
							<div className="flex flex-col gap-3">
								<p className="m-0 text-[#FFFFFF99] text-[13px]">
									{/* Watch the video, find the code and paste it here */}
									{detailTask?.description || ''}
								</p>
								<a
									href={
										detailTask?.url?.startsWith('http') ||
										detailTask?.url?.length === 0
											? detailTask?.url
											: `https://t.me/${detailTask?.url?.slice(1)}`
									}
									onClick={() => handleClickTask(detailTask?.taskId || '')}
									target="_blank"
									rel="noreferrer"
									className="flex items-center w-full min-h-[48px]"
								>
									<div className="item-base flex flex-row px-3 justify-between truncate flex-1">
										<p className="truncate m-0 p-0 text-white">
											{detailTask?.url?.startsWith('http') ||
											detailTask?.url?.length === 0
												? detailTask?.url
												: `https://t.me/${detailTask?.url?.slice(1)}`}
										</p>

										<img
											src="/images/icons/arrow-right.svg"
											alt="icon-arrow-right"
										/>
									</div>
								</a>
								{!detailTask?.isCompleted &&
									clickTime !== Number.MAX_SAFE_INTEGER &&
									clickTime + FIVE_MINUTES > Date.now() && (
										<p className="m-0 text-[13px]" style={{ color: '#ffcc00' }}>
											* Looks like you were on duty, we're checking
										</p>
									)}

								{/* {Number(detailTask?.category) === 0 && (
									<OkInput
										isDisabledInput={detailTask?.isCompleted}
										isShowButtonRight={false}
										onChange={handleChangeCode}
										type="text"
										value={code}
										messageError={messageError}
										rootClass="w-full"
										placeholder="Paste the code here"
									/>
								)} */}
							</div>
							<OKButton
								isLoading={isLoadingFinishTask}
								handleOnClick={handleFinish}
								text="Finish task"
								rootClass={`rounded-xl text-center ${
									messageError !== null && 'mt-3'
								}`}
								isDisable={
									detailTask?.isCompleted ||
									(!detailTask?.isCompleted &&
										clickTime + FIVE_MINUTES > Date.now())
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default OkTaskDetail;
