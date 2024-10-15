import OKButton from '@/components/Button';
import React from 'react';

type Props = {};

const InviteFriend = (props: Props) => {
	return (
		<div>
			<OKButton
				rootClass="w-full primary-button rounded-lg text-base"
				text={'Invite a Friend!'}
			/>
		</div>
	);
};

export default InviteFriend;
