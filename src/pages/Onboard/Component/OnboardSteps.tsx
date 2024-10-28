import React, { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OKButton from '@/components/Button';
import Lottie from 'react-lottie';
import FireWorkAnimation from '@/assets/animation/firework.json';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { get } from 'lodash';
import { confirmAirdropPoint, getAirdropPoint } from '@/services/auth';
import { formatNumberDownRound } from '@/helpers';
import { toast } from 'react-toastify';

interface OnboardStepsProps {}

const OnboardSteps = () => {
	const navigate = useNavigate();
	const [airdrop, setAirdrop] = useState(null);
	const steps = [
		<StepOne />,
		<StepTwo year={get(airdrop, 'year', 0)} />,
		<StepThree airdrop={get(airdrop, 'airdrop', 0)} />
	];

	useEffect(() => {
		handleGetAirdropPoint();
	}, []);

	const [currentStep, setCurrentStep] = useState(0);
	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			handleConfirmAirdrop();
		}
	};

	const handleGetAirdropPoint = async () => {
		try {
			const res = await getAirdropPoint();
			console.log('handleGetAirdropPoint===', res);
			if (get(res, 'data.success', false)) {
				setAirdrop(get(res, 'data.data', null));
			}
		} catch (error) {}
	};

	const handleConfirmAirdrop = async () => {
		try {
			const res = await confirmAirdropPoint();
			console.log('handleConfirmAirdrop===', res);
			if (get(res, 'data.success', false)) {
				navigate('/tap', { replace: true });
			} else {
				toast.error(
					get(res, 'data.message', 'Oops! Something wrong happened!')
				);
				navigate('/tap', { replace: true });
			}
		} catch (error) {
			alert('Oops! Something wrong happened!');
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
							{steps[currentStep]}
						</motion.div>
					</div>

					<OKButton
						handleOnClick={handleNext}
						rootClass="flex-none primary-button rounded-lg text-base mb-4"
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
		{ isChecked: true, description: 'OG Status Confirmed' }
	];

	// const [items, setItems] = useState(initialItems);

	// useEffect(() => {
	// 	items.forEach((_, index) => {
	// 		setTimeout(() => {
	// 			setItems(prevItems => {
	// 				const newItems = [...prevItems];
	// 				newItems[index].isChecked = true;
	// 				return newItems;
	// 			});
	// 		}, index * 1000);
	// 	});
	// }, []);

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
interface StepTwoProps {
	year: number;
}
function StepTwo({ year }: StepTwoProps) {
	const { userData } = useUser();

	return (
		<div className="flex flex-col h-full gap-8">
			<div className="text-[28px] font-medium">You’ve joined Telegram</div>
			<div className="grow flex flex-col gap-4 m-auto">
				<div className="text-9xl font-semibold">{year}</div>
				<div className="text-[28px]">
					<div>years ago</div>
					<span>🎉</span>
				</div>
			</div>
			<div className="text-base font-medium">
				<div>Your account number is #{get(userData, 'telegramId', '')}</div>
				<div>You’re in the Top 75% Telegram users</div>
			</div>
		</div>
	);
}
interface StepThreeProps {
	airdrop: number;
}
function StepThree({ airdrop }: StepThreeProps) {
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
					<div className="text-6xl font-semibold">
						{formatNumberDownRound(airdrop)}
					</div>
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
