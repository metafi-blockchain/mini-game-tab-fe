import OKButton from '@/components/Button';
import Toolbar from '@/components/Toolbar';
import { Button } from '@telegram-apps/telegram-ui';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {};

const Onboard = (props: Props) => {
	const navigate = useNavigate();
	return (
		<Fragment>
			<div className="body-page">
				<div className="content-page h-full jusify-between pt-6 px-4 gap-4 space-y-6">
					<div className="flex flex-col justify-between items-center gap-6 h-full">
						<div className="flex-1 flex flex-col justify-center items-center gap-6">
							<img
								src="/images/icons/logo.svg"
								width={313}
								height={93}
								alt="logo-eternal-kingdoms"
							/>
							<div className="text-center font-medium">
								<div className="">You’ve been in Telegram for a while,</div>
								<div>it’s time to get rewarded!</div>
							</div>
						</div>
						<OKButton
							handleOnClick={() => {
								navigate('/onboard/steps', { replace: true });
							}}
							rootClass="w-full primary-button rounded-lg text-base"
							text={"Let's go"}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Onboard;
