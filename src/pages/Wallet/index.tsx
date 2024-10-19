import { useEffect, useState } from 'react';
import './index.scss';
import { get } from 'lodash';
import { handleGetStatistic } from '@/services';
import { formatNumberDownRound } from '@/helpers';
import { PrivateLayout } from '@/components/PrivateLayout';
import { useUser } from '@/contexts/UserContext';
import { config } from '@/config';
import BigNumber from 'bignumber.js';
export interface IItemWallet {
	title: string;
	countTouch: string;
}

const OkWallet = () => {
	const { userData } = useUser();
	const [dataWallet, setDataWallet] = useState<IItemWallet[]>([
		{ title: 'Total Touches', countTouch: '-' },
		{ title: 'Total Players', countTouch: '-' },
		{ title: 'Daily Users', countTouch: '-' },
		{ title: 'Online Players', countTouch: '-' }
	]);
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
	}, []);
	useEffect(() => {
		setTimeout(() => {
			getInfoWallet();
		}, 1000);
	}, []);

	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="body-page">
				<div className="content-page pt-6 px-4 gap-4">
					{/* <div
						className="text-center pb-2"
						style={{ borderBottom: '1px solid #1E293B' }}
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
					</div> */}
					<div className="text-center pb-2">
						<h4 className="text-[#FFFFFF99] m-0 text-[14px]">
							Your Current Achievement
						</h4>
						<div className="flex flex-row items-center justify-center gap-3">
							<img
								width={28}
								height={28}
								src="/images/icons/coin.svg"
								alt="icon-coin"
							/>
							<h1 className="text-[36px] m-0 text-white font-semibold">
								{formatNumberDownRound(totalShare)}
							</h1>
						</div>
					</div>
					<div className="flex flex-col flex-1 gap-4 overflow-auto">
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
		</PrivateLayout>
	);
};
export default OkWallet;
