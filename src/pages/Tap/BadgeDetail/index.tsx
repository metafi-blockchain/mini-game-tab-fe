// @ts-ignore
import Toolbar from '@/components/Toolbar';
import { ReactNode, useEffect, useState } from 'react';
import { Carousel } from '@trendyol-js/react-carousel';
import { useUser } from '@/contexts/UserContext';
import { PrivateLayout } from '@/components/PrivateLayout';
import { findIndex } from 'lodash';
interface IItemSlide {
	content: string | ReactNode;
	type: string;
}

const BadgeDetail = () => {
	const { userData } = useUser();
	const initialSlides = [
		{
			type: 'Bronze',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	 text-center my-0 text-neutral-50 font-semibold">
							Bronze
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/bronze.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Silver',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl text-center my-0 text-neutral-50 font-semibold">
							Silver
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/silver.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Gold',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Gold
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/gold.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Platinum',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Platinum
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/platinum.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Diamond',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Diamond
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/diamond.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Master',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Master
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/master.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Coach',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Coach
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/coach.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Chairman',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Chairman
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/chairman.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Shark',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Shark
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/shark.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'Lords',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							Lords
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/lord.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		},
		{
			type: 'King',
			content: (
				<div className="flex flex-col">
					<div>
						<h1 className="text-4xl	text-center my-0 text-neutral-50 font-semibold">
							King
						</h1>
						<p className="text-center mt-0 text-[#FFFFFF99] text-[11px]">
							The league you are placed in is determined by
							<br /> the number of shares you have.
						</p>
					</div>
					<img
						src="/images/trophy/king.png"
						alt="icon-trophy"
						height={320}
						width={310}
					/>
				</div>
			)
		}
	];
	const [slides, setSlides] = useState<IItemSlide[]>([]);
	useEffect(() => {
		if (userData !== null) {
			const currentRank = findIndex(
				initialSlides,
				(item: IItemSlide) =>
					item.type.toLocaleLowerCase() ===
					userData.userRank.toLocaleLowerCase()
			);
			const tail = initialSlides.slice(currentRank);
			const leading = initialSlides.slice(0, currentRank);
			setSlides([...tail, ...leading]);
		}
	}, [userData]);

	return (
		<PrivateLayout>
			<div className="body-page">
				<div className="content-page">
					<div className="flex flex-col pt-[58px] h-full">
						{slides.length > 0 && (
							<Carousel
								show={1}
								slide={1}
								transition={0.5}
								swiping={true}
								leftArrow={
									<div className="flex justify-start items-center absolute left-3 top-[55%] z-10 w-[30px] h-[40px]">
										<img
											width={8}
											height={14}
											className="position-icon"
											src="/images/icons/arrow-left-white.svg"
											alt="icon-ball"
										/>
									</div>
								}
								rightArrow={
									<div className="flex justify-end items-center absolute right-3 top-[55%] z-10 w-[30px] h-[40px]">
										<img
											width={8}
											height={14}
											className="position-icon"
											src="/images/icons/arrow-right-white.svg"
											alt="icon-ball"
										/>
									</div>
								}
							>
								{slides.map((item, index) => (
									<div key={index} className="flex items-center justify-center">
										{item.content}
									</div>
								))}
							</Carousel>
						)}
					</div>
				</div>
			</div>
		</PrivateLayout>
	);
};
export default BadgeDetail;
