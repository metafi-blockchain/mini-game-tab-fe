import OKButton from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { formatNumberDownRound } from '@/helpers';
import ProgressBar from '@ramonak/react-progress-bar';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ILineItemSocial {
	leftIcon?: ReactNode;
	title?: string | ReactNode;
	reward?: number;
	percent?: any;
	isCompleted?: boolean;
	isClaimed?: boolean;
	taskId: string;
}

interface IPropsLineItemSocial {
	data: ILineItemSocial;
	handleClick?: () => void;
	handleNavigate?: () => void;
	isDifferent?: boolean;
	showStep?: boolean;
}

const LineItemSocial = (props: IPropsLineItemSocial) => {
	const {
		leftIcon,
		title,
		reward,
		percent = 0,
		isCompleted = false,
		isClaimed = false,
		taskId
	} = props.data;
	const { handleNavigate, handleClick } = props;
	const navigate = useNavigate();

	return (
		<Card>
			<CardHeader className="px-4 py-3">
				<div className="flex gap-4">
					<div className="flex-none flex items-center">{leftIcon}</div>
					<div className="flex-1 flex gap-4 justify-between">
						<div className="space-y-2 flex-1">
							<span className="text-sm font-medium truncate">{title}</span>
							<div className="flex items-center gap-2">
								<img
									src="/images/icons/coin.svg"
									alt="icon-coin"
									width={16}
									height={16}
									className=""
								/>
								<span className="text-xs">{formatNumberDownRound(reward)}</span>
							</div>
						</div>
						{isCompleted ? (
							isClaimed ? (
								<OKButton
									text={
										<img
											src="/images/icons/checked-disable.svg"
											alt="checked-disable"
											width={16}
											height={16}
										/>
									}
									rootClass="px-4 py-1 text-sm flex-none h-[32px]"
									isDisable={true}
								/>
							) : (
								<OKButton
									handleOnClick={handleClick && handleClick}
									text={'Claim'}
									rootClass="px-4 py-1 text-sm flex-none bg-[#29B314] h-[32px]"
								/>
							)
						) : (
							<OKButton
								handleOnClick={() => navigate(`/task/detail/${taskId}`)}
								text={'Start'}
								rootClass="px-4 py-1 text-sm bg-[#F5C033] flex-none h-[32px]"
							/>
						)}
					</div>
				</div>
			</CardHeader>
		</Card>
	);
};

export interface ILineItemOther {
	title?: string | ReactNode;
	reward?: number;
	percent?: any;
	isCompleted: boolean;
	isClaimed: boolean;
}
interface IPropsLineItemOther {
	iconKey?: string;
	data: ILineItemOther;
	handleClick?: () => void;
	handleNavigate?: () => void;
	isDifferent?: boolean;
	showStep?: boolean;
}
const LineItemOther = (props: IPropsLineItemOther) => {
	const {
		title,
		reward,
		percent = 0,
		isCompleted = false,
		isClaimed = false
	} = props.data;
	const { handleClick, iconKey } = props;

	return (
		<Card>
			<CardHeader className="px-4 py-3">
				<div className="flex gap-4">
					<div className="flex-none flex items-center">
						<img
							src={`/images/icons/task-${iconKey}.svg`}
							alt={`task-${iconKey}`}
							width={40}
							className="overflow-visible"
						/>
					</div>
					<div className="flex-1 space-y-2">
						<div className="flex gap-4 justify-between">
							<div className="space-y-2 flex-1">
								<span className="text-sm font-medium truncate">{title}</span>
								<div className="flex items-center gap-2 text-xs">
									<img
										src="/images/icons/coin.svg"
										alt="icon-coin"
										width={16}
										height={16}
									/>
									<span>{formatNumberDownRound(reward)}</span>
								</div>
							</div>
							{isCompleted ? (
								isClaimed ? (
									<OKButton
										text={
											<img
												src="/images/icons/checked-disable.svg"
												alt="checked-disable"
												width={16}
												height={16}
											/>
										}
										rootClass="px-4 py-1 text-sm flex-none h-[32px]"
										isDisable={true}
									/>
								) : (
									<OKButton
										handleOnClick={handleClick && handleClick}
										text={'Claim'}
										rootClass="px-4 py-1 text-sm flex-none bg-[#29B314] h-[32px]"
									/>
								)
							) : (
								<OKButton
									text={'Claim'}
									rootClass="px-4 py-1 text-sm bg-[#F5C033] flex-none h-[32px]"
									isDisable={true}
								/>
							)}
						</div>
						<div className="">
							<ProgressBar
								customLabel={' '}
								completed={percent}
								barContainerClassName="bar-container h-[10px]"
								className="bar-wrapper m-0"
								maxCompleted={100}
							/>
						</div>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
};

export { LineItemSocial, LineItemOther };
