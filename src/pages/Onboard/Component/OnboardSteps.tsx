import React, { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import OKButton from '@/components/Button';
import Lottie from 'react-lottie';
import FireWorkAnimation from '@/assets/animation/firework.json';
import { useNavigate } from 'react-router-dom';

interface OnboardStepsProps {}

const OnboardSteps = () => {
	const navigate = useNavigate();
	const steps = [
		{
			title: <StepOne />
		},
		{
			title: <StepTwo />
		},
		{ title: <StepThree /> }
	];

	const [currentStep, setCurrentStep] = useState(0);
	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			navigate('/tap', { replace: true });
		}
	};

	return (
		<Fragment>
			<div className="body-page">
				<div className="content-page h-full jusify-between pt-6 px-4 gap-4 space-y-6 ">
					<div className="flex-1 flex flex-col gap-16 text-center">
						<div className="flex justify-center gap-2">
							{steps.map((step, index) => (
								<motion.div
									key={index + 'step'}
									className={`step ${index <= currentStep ? 'active' : ''}`}
									style={{
										width: '30%',
										height: '3px',
										backgroundColor:
											index <= currentStep ? '#E6AB35' : '#FFFFFF33',
										borderRadius: '36px'
									}}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>
							))}
						</div>
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: -100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 100 }}
							transition={{ duration: 0.5 }}
							className="flex-1"
						>
							{steps[currentStep].title}
						</motion.div>
					</div>

					<OKButton
						handleOnClick={handleNext}
						rootClass="flex-none primary-button rounded-lg text-base"
						text={'Continue'}
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default OnboardSteps;

function StepOne() {
	const items = [
		{ isChecked: true, description: 'Account Age Verified' },
		{ isChecked: true, description: 'Activity Level Analyzed' },
		{ isChecked: true, description: 'Telegram Premium Checked' },
		{ isChecked: false, description: 'OG Status Confirmed' }
	];
	return (
		<div className="flex flex-col gap-8">
			<div className="text-[28px] font-medium">Checking your account</div>
			<div className="space-y-4 m-auto">
				{(items ?? []).map((item, index) => {
					return (
						<div
							key={index + 'step1'}
							className="flex gap-2 text-base font-medium"
						>
							<div>
								{item?.isChecked ? (
									<img
										src="/images/icons/checked-mark.svg"
										alt="checked-mark"
									/>
								) : (
									<img
										src="/images/icons/checked-mark-disable.svg"
										alt="checked-mark-disable"
									/>
								)}
							</div>
							<div>{item?.description}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function StepTwo() {
	return (
		<div className="flex flex-col h-full gap-8">
			<div className="text-[28px] font-medium">You’ve joined Telegram</div>
			<div className="grow flex flex-col gap-4 m-auto">
				<div className="text-9xl font-semibold">3</div>
				<div className="text-[28px]">
					<div>years ago</div>
					<span>🎉</span>
				</div>
			</div>
			<div className="text-base font-medium">
				<div>Your account number is #123456</div>
				<div>You’re in the Top 75% Telegram users</div>
			</div>
		</div>
	);
}

function StepThree() {
	const items = [
		{ isChecked: true, description: 'Account Age Verified' },
		{ isChecked: true, description: 'Activity Level Analyzed' },
		{ isChecked: true, description: 'Telegram Premium Checked' },
		{ isChecked: false, description: 'OG Status Confirmed' }
	];
	return (
		<div className="flex flex-col h-full gap-16">
			<div className="text-[28px] font-medium">You are amazing!</div>
			<div className="grow flex flex-col gap-4 m-auto">
				<div className="font-medium">Here’s your reward</div>
				<div className=" flex items-center gap-2">
					<img
						src="/images/icons/coin.svg"
						alt="icon-coin"
						width={48}
						height={48}
					/>
					<div className="text-6xl font-semibold">12,657</div>
				</div>
			</div>
			<div className="text-base font-medium">
				<div>Thanks for your time on Telegram!</div>
			</div>
			<div className="absolute inset-0 z-0">
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: FireWorkAnimation,
						rendererSettings: {
							preserveAspectRatio: 'xMidYMid slice'
						}
					}}
				/>
			</div>
		</div>
	);
}
