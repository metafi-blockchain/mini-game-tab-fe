import OKButton from '@/components/Button';
import React from 'react';

type Props = {};

const InviteFriend = (props: Props) => {
	return (
		<div className="flex gap-2">
			<OKButton
				rootClass="flex-1 w-full primary-button rounded-xl text-base"
				text={'Invite a Friend!'}
			/>
			<OKButton
				rootClass="primary-button rounded-xl w-14 h-14 p-0"
				text={<img src="/images/icons/coppy.svg" width={24} height={24} />}
			/>
		</div>
	);
};

export default InviteFriend;
