import { ReactNode } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { formatNumberDownRound } from '@/helpers';
import OKButton from '@/components/Button';

export interface IItemTask {
	leftIcon: ReactNode;
	rightElement?: ReactNode;
	type: string;
	title: string | ReactNode;
	category: number;
	description: string;
	isCompleted: boolean;
	reward: number;
	taskId: string;
	url?: string;
	isDifferent?: boolean;
	percent: any;
	isClaimed?: boolean;
	taskValue?: string | number;
	subCategory?: string;
}
interface IPropDetailTask {
	data: IItemTask;
	handleClick?: () => void;
	handleNavigate?: () => void;
	isDifferent?: boolean;
	showStep?: boolean;
}
const ItemTask = (props: IPropDetailTask) => {
	const {
		isDifferent = false,
		leftIcon,
		type,
		title,
		reward,
		percent = 0,
		description,
		isCompleted,
		isClaimed = false,
		taskValue,
		category
	} = props.data;
	const { handleClick, handleNavigate } = props;
	return (
		<div onClick={handleNavigate && handleNavigate}>
			{category === 1 ? (
				<div className="flex flex-row justify-between items-center item-task gap-[10px]">
					{leftIcon}
					<div className="flex flex-row gap-[10px] flex-1">
						<div className="flex-1 flex flex-col justify-between">
							<>
								<span
									className="text-[12px] font-medium"
									style={{ color: 'rgba(255, 255, 255, 0.6)' }}
								>
									{description}
								</span>
								<span
									className="text-[15px] font-large text-white"
									style={{ fontWeight: 'bold' }}
								>
									{title}
								</span>
								<div className="flex flex-row gap-1" style={{ marginTop: 4 }}>
									<img src="/images/icons/coin.svg" alt="icon-coin" />
									<span className="text-[14px] font-normal text-white">
										{formatNumberDownRound(reward)}
									</span>
								</div>
							</>
						</div>
						{isCompleted ? (
							isClaimed ? (
								<img src="/images/icons/checked.svg" alt="icon-check" />
							) : (
								<OKButton
									handleOnClick={handleClick && handleClick}
									text={'Claim'}
								/>
							)
						) : (
							<img src="/images/icons/arrow-right.svg" alt="icon-coin" />
						)}
					</div>
				</div>
			) : isDifferent ? (
				<div className="flex flex-row justify-between gap-[10px] items-center item-task">
					{leftIcon}
					<div className="flex flex-col flex-1 gap-3">
						<div className="flex flex-row justify-between">
							<div className="flex flex-col">
								<span className="text-sm font-medium">{title}</span>
								<div className="flex flex-row gap-1">
									<img src="/images/icons/coin.svg" alt="icon-coin" />
									<span className="text-[12px] font-normal text-white">
										{reward}
									</span>
								</div>
							</div>
							{isCompleted ? (
								<img src="/images/icons/checked.svg" alt="icon-check" />
							) : (
								<OKButton
									handleOnClick={handleClick && handleClick}
									text={'Claim'}
								/>
							)}
						</div>
						<div className="">
							<ProgressBar
								customLabel={' '}
								completed={percent}
								barContainerClassName="bar-container"
								className="bar-wrapper m-0"
								maxCompleted={100}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-row justify-between items-center item-task gap-[10px]">
					{leftIcon}
					<div className="flex flex-row gap-[10px] flex-1">
						<div className="flex-1 flex flex-col justify-between">
							{type === 'coin' ? (
								<>
									<span className="text-[14px] font-medium text-white">
										{title}
									</span>
									<div className="flex flex-row gap-1">
										<img src="/images/icons/coin.svg" alt="icon-coin" />
										<span className="text-[12px] font-normal text-white">
											{formatNumberDownRound(reward)}
										</span>
									</div>
								</>
							) : (
								<>
									<div className="flex justify-between">
										<div className="text-[14px] font-medium text-white">
											{title}
											{/* {category !== 2 && (
												<span className="text-[#FFFFFF99] font-normal">
													{' '}
													({percent}%)
												</span>
											)} */}
										</div>
										<div className="flex flex-row gap-1">
											<img src="/images/icons/coin.svg" alt="icon-coin" />
											<span className="text-white">
												{formatNumberDownRound(reward)}
											</span>
										</div>
									</div>
									<div className="flex flex-row gap-2 text-white">
										{props.showStep && formatNumberDownRound(Number(taskValue))}
										<div
											className={`flex-1 ${
												props.showStep ? 'pt-2' : 'pt-1'
											} text-white`}
										>
											<ProgressBar
												customLabel={' '}
												completed={percent}
												barContainerClassName="bar-container"
												className="bar-wrapper m-0"
												maxCompleted={100}
											/>
										</div>
									</div>
								</>
							)}
						</div>
						{isCompleted ? (
							isClaimed ? (
								<img src="/images/icons/checked.svg" alt="icon-check" />
							) : (
								<OKButton
									handleOnClick={handleClick && handleClick}
									text={'Claim'}
								/>
							)
						) : (
							<img src="/images/icons/arrow-right.svg" alt="icon-coin" />
						)}
					</div>
				</div>
			)}
		</div>
	);
};
export default ItemTask;
