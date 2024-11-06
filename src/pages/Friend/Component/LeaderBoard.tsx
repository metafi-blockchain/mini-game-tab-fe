import { Card, CardHeader } from '@/components/Card';
import React from 'react';
import { FriendLineItem } from './Friends';

type Props = {
	items?: any[];
};

const LeaderBoard = ({
	items = [
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 },
		{ name: 'Sophia', coin: 99999 }
	]
}: Props) => {
	return (
		<div className="">
			<Card className="p-4">
				<div className="leaderboard-list">
					<FriendLineItem
						key={`friend-key-you`}
						index={999}
						item={{ name: 'ThanhNX', coin: 9999991 }}
						className="text-[#F5C033]"
					/>
					{(items ?? []).map((item, index) => {
						return (
							<FriendLineItem
								key={`friend-key-${index}`}
								index={index}
								item={item}
							/>
						);
					})}
				</div>
			</Card>
		</div>
	);
};

export default LeaderBoard;
