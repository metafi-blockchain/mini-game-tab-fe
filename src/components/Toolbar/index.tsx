import { useLocation, useNavigate } from 'react-router-dom';
import IconPeople from '../Icon/IconPeople';
import IconTask from '../Icon/IconTask';
import IconTap from '../Icon/IconTap';
import IconBoost from '../Icon/IconBoost';
import IconWallet from '../Icon/IconWallet';
import React from 'react';

interface ITabItem {
	image: React.ReactNode;
	title: string;
	key: string[];
	label: string;
}
const Toolbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { pathname } = location;
	const splitPath = pathname.split('/');
	const items: ITabItem[] = [
		{
			image: <IconPeople />,
			title: 'icon-people',
			key: ['friends'],
			label: 'Friends'
		},
		{
			image: <IconTask />,
			title: 'icon-task',
			key: ['task'],
			label: 'Task'
		},
		{
			image: <IconTap />,
			title: 'icon-tap',
			key: ['tap'],
			label: 'Tap'
		},
		{
			image: <IconBoost />,
			title: 'icon-boost',
			key: ['boost'],
			label: 'Boost'
		},
		{
			image: <IconWallet />,
			title: 'wallet',
			key: ['wallet'],
			label: 'Wallet'
		}
	];
	return (
		<div className="content-toolbar">
			<ul className="toolbar">
				{items.map(item => (
					<li
						onClick={() => navigate(item.key[0], { replace: true })}
						key={item.title}
						className={`${
							item.key.findIndex(key => key === splitPath[1]) >= 0
								? 'item-active'
								: ''
						}`}
					>
						<div className="item-toolbar">
							{item.image}
							<span className="text-white">{item.label}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Toolbar;
