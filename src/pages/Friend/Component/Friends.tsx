import { Card, CardHeader } from '@/components/Card';
import { formatNumberDownRound } from '@/helpers';
import { cn } from '@/utils';

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items?: any[];
};

const Friends = ({ items = [] }: Props) => {
	return (
		<>
			<div className="flex justify-between gap-4">
				<Card className="w-full">
					<CardHeader className="p-4">
						<div className="text-xs font-medium">Invited friends</div>
						<div className="flex items-center gap-2 text-sm">
							<div className="text-base">🤝</div>
							<div>x</div>
							<div>{formatNumberDownRound(items.length)}</div>
						</div>
					</CardHeader>
				</Card>
				<Card className="w-full">
					<CardHeader className="p-4">
						<div className="text-xs font-medium">Coins earned</div>
						<div className="flex items-center gap-2 text-sm">
							<img
								src="/images/icons/coin.svg"
								alt="icon-coin"
								width={16}
								height={16}
							/>
							<div>x</div>
							<div>{formatNumberDownRound(0)}</div>
						</div>
					</CardHeader>
				</Card>
			</div>
			<div>
				<Card style={{ overflow: 'visible' }}>
					<CardHeader className="p-4">
						<div className="flex gap-2">
							<img
								src="/images/icons/coin.svg"
								alt="icon-coin"
								width={58}
								height={58}
								className="overflow-visible"
							/>
							<div className="text-xs font-medium space-y-1">
								<div className="flex gap-2">
									<img
										src="/images/icons/gift-box.svg"
										alt="icon-gift-box"
										width={16}
										height={16}
										className="overflow-visible"
									/>
									<div className="text-[#FEFFFF99]">
										<span className="text-white">10% </span>for you on the total
										points earned by your friends, up to 30,000 points.
									</div>
								</div>
								<div className="flex gap-2">
									<img
										src="/images/icons/gift-box.svg"
										alt="icon-gift-box"
										width={16}
										height={16}
										className="overflow-visible"
									/>
									<div className="text-[#FEFFFF99]">
										<span className="text-white">500 coins </span>for your
										friend!
									</div>
								</div>
							</div>
						</div>
					</CardHeader>
				</Card>
			</div>

			<div className="space-y-2">
				<div className="text-base font-semibold">
					Your Friends ({items?.length ?? 0})
				</div>
				<Card className="your-friend-list">
					{items?.length > 0 ? (
						<CardHeader className="p-4">
							{(items ?? []).map((item, index) => {
								return (
									<FriendLineItem
										key={`friend-key-${index}`}
										index={index}
										item={item}
									/>
								);
							})}
						</CardHeader>
					) : (
						<CardHeader className="p-4 h-full">
							<div className="h-full content-center text-center text-[#FEFFFF99] text-xs font-meidum">
								You haven’t invited anyone yet
							</div>
						</CardHeader>
					)}
				</Card>
			</div>
		</>
	);
};

export default Friends;

type FriendLineItemProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	item: any;
	index: number;
	className?: string;
};

export function FriendLineItem({
	item,
	index,
	className = ''
}: FriendLineItemProps) {
	return (
		<div
			className={cn(
				className,
				'flex items-center gap-4 text-sm font-medium h-[48px]'
			)}
		>
			<div className="flex-none min-w-12">{index + 1}</div>
			<div className="flex-1">
				{item?.firstName} {item?.lastName}
			</div>
			<div className="flex-none min-w-28 flex items-center gap-2">
				<img
					src="/images/icons/coin.svg"
					alt="icon-coin"
					width={16}
					height={16}
				/>
				<div>{formatNumberDownRound(item?.coin)}</div>
			</div>
		</div>
	);
}
