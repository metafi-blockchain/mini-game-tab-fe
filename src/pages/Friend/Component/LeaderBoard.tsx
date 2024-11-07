import { Card, CardHeader } from '@/components/Card';
import React from 'react';
import { FriendLineItem } from './Friends';
import { NoItem } from '@/pages/Task/Component/NoItem';

type Props = {
	items?: any[];
};

const LeaderBoard = ({
	items = [
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 },
		// { name: 'Sophia', coin: 99999 }
	]
}: Props) => {
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
