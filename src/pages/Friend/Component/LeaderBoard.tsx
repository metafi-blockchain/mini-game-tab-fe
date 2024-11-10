import { Card, CardHeader } from '@/components/Card';
import React, { useEffect, useState } from 'react';
import { FriendLineItem } from './Friends';
import { NoItem } from '@/pages/Task/Component/NoItem';
import { fetchLeaderboard } from '@/services/auth';
import { get } from 'lodash';
import { useUser } from '@/contexts/UserContext';
import { formatNumberDownRound } from '@/helpers';

type Props = {
	items?: any[];
};

const LeaderBoard = ({}: Props) => {
	const { userData, getMeInfo } = useUser();
	const [items, setItems] = useState<any>([]);

	useEffect(() => {
		getMeInfo();
		handleGetLeaderboard();
	}, []);

	const handleGetLeaderboard = async () => {
		try {
			const res = await fetchLeaderboard();
			// console.log('res', res);
			setItems(get(res, 'data.data', []));
		} catch (error) {}
	};

	if (items.length == 0) {
		return (
			<NoItem
				cls="mt-3"
				msg="No leaderboard available!"
				subMsg="Each tournament will only last for 1 month and will reset the following month."
			/>
		);
	}
	return (
		<div className="flex flex-col gap-4">
			<div>
				<Card style={{ overflow: 'visible' }}>
					<CardHeader className="p-4">
						<div className="flex gap-2">
							<img
								src="/images/icons/coin.svg"
								alt="icon-coin"
								width={58}
								height={58}
								className="overflow-visible"
							/>
							<div className="text-xs font-medium space-y-1">
								<div className="flex text-[#FEFFFF99]">
									- The leaderboard is updated
									<span className="text-white ml-1">every day at 0h UTC.</span>
								</div>
								<div className="flex text-[#FEFFFF99]">
									- Each tournament will last 2 month and end in the last day of
									the second month.
								</div>
							</div>
						</div>
					</CardHeader>
				</Card>
			</div>
			<Card className="">
				<div className="leaderboard-list">
					<span className="text-white p-4">Your current acheivement</span>
					{/* <FriendLineItem
						key={`friend-key-you`}
						index={0}
						item={{
							firstName: userData?.firstName,
							lastName: userData?.lastName,
							tournamentBalance: userData?.tournamentBalance
						}}
						className="text-[#F5C033]"
					/> */}
					<div
						className="flex items-center gap-2 text-center p-4"
						style={{ justifyContent: 'center', fontSize: 40 }}
					>
						<img
							src="/images/icons/coin.svg"
							alt="icon-coin"
							width={30}
							height={30}
						/>
						<div className={`text-white`}>
							{formatNumberDownRound(userData?.tournamentBalance)}
						</div>
					</div>
					<span className="text-white p-4">Last updated ranking</span>
					<div className="mt-2">
						{(items ?? []).map((item: any, index: number) => {
							return (
								<FriendLineItem
									key={`friend-key-${item?.telegramId}`}
									index={index}
									item={item}
									className={
										userData?.telegramId === item?.telegramId
											? 'text-[#F5C033]'
											: ''
									}
									style={
										userData?.telegramId === item?.telegramId
											? { backgroundColor: 'rgba(255, 255, 255, 0.1' }
											: {}
									}
								/>
							);
						})}
					</div>
				</div>
			</Card>
		</div>
	);
};

export default LeaderBoard;
