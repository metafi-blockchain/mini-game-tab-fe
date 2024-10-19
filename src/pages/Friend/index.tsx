/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { config } from '@/config';
import React, { useEffect, useState } from 'react';
import { handleGetListFriends } from '@/services';
import { useUser } from '@/contexts/UserContext';
import { get } from 'lodash';
import copy from 'copy-to-clipboard';
import OKButton from '@/components/Button';
import { PrivateLayout } from '@/components/PrivateLayout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Friends from './Component/Friends';
import LeaderBoard from './Component/LeaderBoard';
import InviteFriend from './Component/InviteFriend';

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
	const { userData } = useUser();
	const navigate = useNavigate();

	const [friends, setFriends] = useState<any>([]);
	const [copied, setCopied] = useState<boolean>(false);

	const getListFriend = async () => {
		try {
			const response = await handleGetListFriends();
			setFriends(get(response, 'data.data', []));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getListFriend();
	}, []);

	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		}
	}, [copied]);

	const handleCopy = () => {
		copy(`${config.REF_LINK}${get(userData, 'telegramId', '')}`);
		setCopied(true);
	};

	// const handleShare = () => {
	// 	utils.openTelegramLink(
	// 		'https://t.me/share/url?url=https://t.me/sports_hero_bot/sportshero'
	// 	);
	// };

	const [selectedTab, setSelectedTab] = useState<'friends' | 'leaderboard'>(
		'friends'
	);

	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="body-page">
				<div className="content-page pt-6 px-4 gap-4">
					<div className="flex justify-center items-center gap-8 text-lg text-[#FEFFFF99] uppercase">
						<div onClick={() => setSelectedTab('friends')}>
							{selectedTab === 'friends' ? (
								<img
									src="/images/friend-friends.svg"
									alt="friends-tab"
									className="mt-4"
								/>
							) : (
								<div className="text-xl">Friends</div>
							)}
						</div>
						<div onClick={() => setSelectedTab('leaderboard')}>
							{selectedTab === 'leaderboard' ? (
								<img
									src="/images/friend-leaderboard-tab.svg"
									alt="friends-tab"
									className="mt-4"
								/>
							) : (
								<div className="text-xl">LeaderBoard</div>
							)}
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
									<Friends />
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
