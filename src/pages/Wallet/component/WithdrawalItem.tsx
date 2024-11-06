/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatNumberDownRound, minimizeAddress } from '@/helpers';
import './index.scss';

export interface IPropWithdrawalItem {
	name?: string;
	wallet?: number;
	amount?: any;
	address?: string;
	time?: string;
	status: string;
	isDiff?: boolean;
}
const WithdrawalItem = (props: IPropWithdrawalItem) => {
	const { name, amount, status, isDiff = false, address } = props;
	return (
		<div className="flex flex-row gap-3 mt-2 item-booster items-center bg-card h-[67px]">
			<div className="flex flex-1 flex-row justify-between">
				<div className="flex flex-1 flex-col">
					<div className="flex flex-col gap-1">
						{isDiff ? (
							<div className="withdrawal-item-header">
								<div className="withdrawal-item-name">
									<span className="text-sm font-medium">{name}</span>
								</div>
								<div className="withdrawal-item-value">
									<img
										src="/images/icons/ton-logo.svg"
										width={16}
										height={16}
										alt="ton-coin"
									/>
									<span className="text-sm font-medium text-white">
										{formatNumberDownRound(amount)}
									</span>
								</div>
							</div>
						) : (
							<div className="withdrawal-item-header">
								<div className="withdrawal-item-value">
									<img
										src="/images/icons/ton-logo.svg"
										width={16}
										height={16}
										alt="ton-coin"
									/>
									<span className="text-sm font-medium text-white">
										{formatNumberDownRound(amount)}
									</span>
								</div>
								<div>
									<span className={`withdrawal-item-name ${status}`}>
										{status}
									</span>
								</div>
							</div>
						)}

						<a
							rel="noreferrer"
							href={`${import.meta.env.VITE_TON_SCAN}/${address}`}
							target="_blank"
							className="text-[#FFFFFF99] font-normal text-xs"
						>
							{minimizeAddress(address, 12)}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
export default WithdrawalItem;
