import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Toolbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { pathname } = location;
	const splitPath = pathname.split('/');
	const items = [
		{
			image: '/images/icons/people.svg',
			title: 'icon-people',
			key: ['friends'],
			label: 'Friends'
		},
		{
			image: '/images/icons/new-task.svg',
			title: 'icon-task',
			key: ['task'],
			label: 'Task'
		},
		{
			image: '/images/icons/tap-toolbar.svg',
			title: 'icon-tap',
			key: ['tap'],
			label: 'Tap'
		},
		{
			image: '/images/icons/new-boost.svg',
			title: 'icon-boost',
			key: ['boost'],
			label: 'Boost'
		},
		{
			image: '/images/icons/new-wallet.svg',
			title: 'wallet',
			key: ['wallet'],
			label: 'Wallet'
		}
	];
	return (
		<div className="content-toolbar">
			<ul className="toolbar">
				{items.map((item: any) => (
					<li
						onClick={() => navigate(item.key[0], { replace: true })}
						key={item.title}
						className={`${
							item.key.findIndex((key: any) => key === splitPath[1]) >= 0
								? 'item-active'
								: ''
						}`}
					>
						<div className="item-toolbar">
							<img src={item.image} alt={item.title} />
							<span className="text-white">{item.label}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Toolbar;
