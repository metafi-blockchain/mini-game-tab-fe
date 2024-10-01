import { formatNumberDownRound } from '@/helpers';
import { ReactNode } from 'react';

export interface IPropItemBooster {
	leftIcon: ReactNode;
	name: string;
	price: number;
	onClickItem?: () => void;
	id?: string;
	remaining?: number;
	isCompleted?: boolean;
	type?: number;
	nextLevel?: number;
	description?: string;
}
const ItemBooster = (props: IPropItemBooster) => {
	const { isCompleted, leftIcon, name, price, remaining, onClickItem, type } =
		props;
	const handleClickItem = () => {
		if ((type !== 4 && remaining === 0) || (type === 4 && isCompleted)) {
			return;
		}
		if (onClickItem) {
			onClickItem();
		}
	};
	return (
		// TO-DO: add disable style for remaining === 0
		<div
			className="flex flex-row gap-3 item-booster items-center"
			onClick={() => handleClickItem()}
		>
			<div className="w-[35px]">{leftIcon}</div>
			<div className="flex flex-row justify-between flex-1">
				<div className="flex flex-col">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-white">{name}</span>
						<div className="flex flex-row">
							<div className="flex flex-row gap-1 items-center">
								{type === 4 ? (
									<img
										src="/images/icons/ton-logo.svg"
										width={16}
										height={16}
										alt="ton-coin"
									/>
								) : (
									<img src="/images/icons/coin.svg" alt="icon-coin" />
								)}
								<span className="text-xs font-normal text-white">
									{formatNumberDownRound(price)}
								</span>
							</div>
							{type !== 3 && type !== 4 && (
								<span className="text-[#FFFFFF99] font-normal text-xs text-addition">
									{remaining} upgrade(s) left
								</span>
							)}
							{type === 3 && (
								<span className="text-[#FFFFFF99] font-normal text-xs text-addition">
									{'Auto tap 172.800 / 12H'}
								</span>
							)}
							{type === 4 && (
								<span className="text-[#FFFFFF99] font-normal text-xs text-addition">
									{'Auto mine 1.000.000 / 24H'}
								</span>
							)}
						</div>
					</div>
				</div>
				{isCompleted ? (
					<img src="/images/icons/checked.svg" alt="icon-checked" width={16} />
				) : (
					<img src="/images/icons/arrow-right.svg" alt="icon-coin" width={16} />
				)}
			</div>
		</div>
	);
};
export default ItemBooster;
