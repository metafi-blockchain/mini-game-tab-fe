/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrivateLayout } from '@/components/PrivateLayout';
import { handleGetListFriends } from '@/services';
import { AnimatePresence, motion } from 'framer-motion';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import Friends from './Component/Friends';
import InviteFriend from './Component/InviteFriend';
import LeaderBoard from './Component/LeaderBoard';

const tabVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: 20 }
};

// revert when to prod
// import { initUtils } from '@tma.js/sdk';
// const utils = initUtils();
export interface IItemFriend {
	avatar: string;
	name: string;
}

const OkFriend = () => {
	const [friends, setFriends] = useState<any>([]);

	const getListFriend = async () => {
		try {
			const response = await handleGetListFriends();
			if (get(response, 'data.success', false)) {
				setFriends(get(response, 'data.data', []));
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getListFriend();
	}, []);

	const [selectedTab, setSelectedTab] = useState<'friends' | 'leaderboard'>(
		'friends'
	);

	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="body-page">
				<div className="content-page pt-6 px-4 gap-4">
					<div className="friends-tabs">
						<div
							className={`tab-item ${
								selectedTab === 'friends' ? 'active' : ''
							}`}
							onClick={() => setSelectedTab('friends')}
						>
							Friends
						</div>
						<div
							className={`tab-item ${
								selectedTab === 'leaderboard' ? 'active' : ''
							}`}
							onClick={() => setSelectedTab('leaderboard')}
						>
							LeaderBoard
						</div>
					</div>

					<div className="flex-1 w-full max-w-lg">
						<AnimatePresence>
							{selectedTab === 'friends' && (
								<motion.div
									key="friends"
									variants={tabVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ duration: 0.5 }}
									className="flex flex-col gap-4"
								>
									<Friends items={friends} />
								</motion.div>
							)}

							{selectedTab === 'leaderboard' && (
								<motion.div
									key="leaderboard"
									variants={tabVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ duration: 0.5 }}
									className="flex flex-col gap-4"
								>
									<LeaderBoard />
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<div className="flex-none">
						<InviteFriend />
					</div>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default OkFriend;
