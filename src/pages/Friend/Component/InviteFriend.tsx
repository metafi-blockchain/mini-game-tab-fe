import OKButton from '@/components/Button';
import { config } from '@/config';
import { useUser } from '@/contexts/UserContext';
import copy from 'copy-to-clipboard';
import { useEffect, useState } from 'react';
// import { initUtils } from '@tma.js/sdk';
// const utils = initUtils();

const InviteFriend = () => {
	const { userData } = useUser();
	const [copied, setCopied] = useState<boolean>(false);
	useEffect(() => {
		if (copied) {
			setTimeout(() => {
				setCopied(false);
			}, 3000);
		}
	}, [copied]);

	const handleCopy = () => {
		if (userData != null) {
			copy(`${config.REF_LINK}${userData.telegramId}`);
			setCopied(true);
		}
	};

	const handleShare = () => {
		// utils.openTelegramLink('https://t.me/share/url?url=https://t.me/ekgsd_bot');
	};
	return (
		<div className="flex gap-2">
			<OKButton
				handleOnClick={handleShare}
				rootClass="flex-1 w-full primary-button rounded-xl text-base"
				text={'Invite a Friend!'}
			/>
			<OKButton
				handleOnClick={handleCopy}
				rootClass={`copy-btn primary-button rounded-xl w-14 h-14 p-0 ${
					copied ? 'copied' : ''
				}`}
				text={
					<img
						src={
							copied ? '/images/icons/copied.svg' : '/images/icons/coppy.svg'
						}
						width={24}
						height={24}
					/>
				}
			/>
		</div>
	);
};

export default InviteFriend;
