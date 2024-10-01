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

	return (
		<PrivateLayout>
			{/* <HeaderPage /> */}
			<div className="body-page">
				<div className="content-page pt-6 px-4 gap-4">
					<div className="flex justify-center items-center flex-col gap-3">
						<img
							width={100}
							height={100}
							src="/images/icons/shake-hands.svg"
							alt="shake-hands"
						/>
						<h1 className="text-4xl m-0 text-white font-semibold">
							{friends.length} Referrals
						</h1>
					</div>
					<div className="flex flex-1 gap-4 flex-col overflow-auto">
						<div className="bg-[#1E293B] flex flex-col gap-1 p-4 rounded-xl min-h-[107px]">
							<div className="flex flex-row justify-between items-center">
								<h3 className="m-0 text-base text-white">My invite link:</h3>
								<div>
									<OKButton
										handleOnClick={handleCopy}
										text={copied ? 'Copied' : 'Copy'}
										rootClass="p-2 mr-3"
									/>
									{/* <OKButton
										handleOnClick={handleShare}
										text={'Share'}
										rootClass="p-2"
										style={{ backgroundColor: '#f5b400' }}
									/> */}
								</div>
							</div>

							<div className="flex flex-row justify-between text-sm gap-1">
								<div className="flex flex-row justify-between items-center gap-1">
									<p
										className="pr-4 m-0 w-full break-all text-white"
										style={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											display: 'inline-block',
											width: '100%',
											direction: 'rtl'
										}}
										// style={{ flex: 1, textOverflow: 'ellipsis !important' }}
									>
										{`${config.REF_LINK}${get(userData, 'telegramId', '')}`}
									</p>
								</div>
							</div>
						</div>
						<div className="bg-[#1E293B] rounded-xl p-4 flex flex-row gap-2 min-h-[88px]">
							<img src="/images/icons/fb.svg" alt="gift" />
							<div
								onClick={() =>
									navigate('/task?active-key=3', { replace: true })
								}
								className="flex flex-1 flex-row justify-between items-center ml-1"
							>
								<div className="flex flex-col justify-around gap-1">
									<p className="p-0 m-0 text-white text-sm">Invite a Friend</p>
									<div className="flex flex-row">
										<img src="/images/icons/coin.svg" alt="gift" />
										<p className="m-0 p-0 text-xs text-white">
											10,000 and more
											<span className="ml-1 text-[#FEFFFF99]">
												for you and your friend!
											</span>
										</p>
									</div>
								</div>
								<div className="py-4">
									<img
										width={16}
										height={16}
										src="/images/icons/arrow-right.svg"
										alt="arrow-right"
									/>
								</div>
							</div>
						</div>
						<div className="bg-[#1E293B] p-4 rounded-xl gap-3 flex flex-col flex-1 min-h-[200px]">
							<h3 className="m-0 text-base text-white">My referrals:</h3>
							{friends.length === 0 ? (
								<div className="flex flex-1 flex-col items-center justify-center gap-1">
									<img
										width={64}
										height={64}
										src="/images/icons/box-empty.svg"
										alt="fast-wind-icon"
									/>
									<span className="text-[#FFFFFF99] text-sm">
										No referrals yet
									</span>
								</div>
							) : (
								<div className="" style={{ overflow: 'scroll' }}>
									{friends.map((friend: any, index: number) => (
										<div
											key={index + friend?.telegramId}
											className="flex flex-row gap-2 py-3"
										>
											{/*<img src={friend.avatar} alt="" />*/}
											<img
												src="/images/friend-example.png"
												alt=""
												width={30}
												height={30}
											/>
											<p className="m-0 truncate text-sm text-white">
												{friend?.firstName} {friend?.lastName}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default OkFriend;
