import CongratulationsAnimation from '@/assets/animation/congratulations.json';
import LightningAnimation from '@/assets/animation/lightning.json';
import OKButton from '@/components/Button';
import { motion } from 'framer-motion';
import React, { Fragment, useEffect, useState } from 'react';
import Lottie from 'react-lottie';

type Props = {};

const DailyCheckIn: React.FC = (props: Props) => {
	const [currentStep, setCurrentStep] = useState<number>(1);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCurrentStep(2);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Fragment>
			<div className="body-page">
				<div className="content-page h-full jusify-between pt-6 px-4 gap-4 space-y-6">
					{currentStep === 1 && (
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.5 }}
							className="flex-1"
						>
							<div className="flex flex-col h-full gap-8 text-[28px] font-medium text-center">
								<div className="grow flex flex-col gap-4 m-auto">
									<div>Congratulations!</div>
									<div className="text-9xl font-semibold">3</div>
									<div>day check-in</div>
								</div>
								<div className="text-base font-medium">
									Check-ins are your best friend here. Make sure to check in
									regularly so you don’t miss out on daily rewards. 🔥
								</div>
								<div className="absolute inset-0 z-0">
									<Lottie
										options={{
											loop: true,
											autoplay: true,
											animationData: CongratulationsAnimation,
											rendererSettings: {
												preserveAspectRatio: 'xMidYMid slice'
											}
										}}
									/>
								</div>
							</div>
						</motion.div>
					)}

					{currentStep === 2 && (
						<>
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.5 }}
								className="flex-1"
							>
								<div className="flex flex-col h-full gap-8 text-base font-medium text-center">
									<div className="grow flex flex-col justify-center gap-4 m-auto">
										<div>Here’s your reward</div>
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
									<div>
										<div>Tip: Skipping a day won’t reset your check-in,</div>
										<div>but you won’t receive rewards for that day.</div>
									</div>
									<div className="absolute inset-0 z-0">
										<Lottie
											options={{
												loop: true,
												autoplay: true,
												animationData: LightningAnimation,
												rendererSettings: {
													preserveAspectRatio: 'xMidYMid slice'
												}
											}}
											style={{
												width: '47px',
												height: '94px',
												marginTop: '36px'
											}}
										/>
									</div>
								</div>
							</motion.div>
							<OKButton
								handleOnClick={() => {}}
								rootClass="flex-none primary-button rounded-lg text-base"
								text={'Continue'}
							/>
						</>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default DailyCheckIn;
