import OKButton from '@/components/Button';
import { formatNumberDownRound, minimizeAddress } from '@/helpers';
import { ReactNode } from 'react';
import './index.scss';

export interface IPropWithdrawalItem {
	name?: string;
	wallet?: number;
	amount?: number;
	address?: string;
	time?: string;
	status: string;
}
const WithdrawalItem = (props: IPropWithdrawalItem) => {
	const { name, wallet, address, time, amount, status } = props;
	return (
		<div className="flex flex-row gap-3 mt-2 item-booster items-center bg-card h-[67px]">
			<div className="flex flex-1 flex-row justify-between">
				<div className="flex flex-1 flex-col">
					<div className="flex flex-col gap-1">
						<div className="flex flex-1 flex-row justify-between">
							<div className="flex flex-1 flex-row ">
								<div className="flex flex-row gap-1 items-center">
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
							<div>
								<span className="text-sm">{status}</span>
							</div>
						</div>
						<a
							href={`${
								import.meta.env.VITE_TON_SCAN
							}/${'UQDBhNgJzBcwQDCVN_QZIijMTQD6FaNyLOHiZGl6t6Zqz1X5'}`}
							target="_blank"
							className="text-[#FFFFFF99] font-normal text-xs"
						>
							{minimizeAddress(
								'UQDBhNgJzBcwQDCVN_QZIijMTQD6FaNyLOHiZGl6t6Zqz1X5',
								12
							)}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
export default WithdrawalItem;
