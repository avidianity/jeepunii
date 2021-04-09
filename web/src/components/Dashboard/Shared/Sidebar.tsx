import React, { createRef, FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../constants';
import { UserContract } from '../../../contracts/user.contract';
import { useURL } from '../../../hooks';
import { State } from '../../../libraries/State';
import { routes } from '../../../routes';

type Props = {};

const colors = ['brown', 'deep-orange', 'deep-purple', 'indigo', 'light-blue', 'pink', 'purple', 'red', 'teal', 'blue'];

const Sidebar: FC<Props> = (props) => {
	const sidebarToggleRef = createRef<HTMLAnchorElement>();
	const url = useURL();
	const state = State.getInstance();

	const user = state.get<UserContract>('user');

	const links = [
		{
			url: url(routes.USERS),
			icon: 'ti-user',
			title: 'Users',
			show: user.role === 'Admin',
		},
		{
			url: url(routes.JEEPS),
			icon: 'ti-car',
			title: 'Jeeps',
			show: user.role !== 'Passenger',
		},
		{
			url: url(routes.COOPERATIVES),
			icon: 'ti-clipboard',
			title: 'Cooperatives',
			show: user.role === 'Admin',
		},
		{
			url: url(routes.SALES),
			icon: 'ti-money',
			title: 'Sales',
			show: !['Driver', 'Passenger'].includes(user.role),
		},
		{
			url: url(routes.LOGS),
			icon: 'ti-time',
			title: 'Logs',
			show: true,
		},
		{
			url: url(routes.CHATS),
			icon: 'ti-comment',
			title: 'Chats',
			show: true,
		},
		{
			url: url(routes.ROUTES),
			icon: 'ti-stats-up',
			title: 'Routes',
			show: true,
		},
		{
			url: url(routes.SETTINGS),
			icon: 'ti-settings',
			title: 'Settings',
			show: true,
		},
	];

	useEffect(() => {
		if (sidebarToggleRef.current) {
			sidebarToggleRef.current.onclick = null;
		}
		//eslint-disable-next-line
	}, []);

	return (
		<div className='sidebar'>
			<div className='sidebar-inner'>
				<div className='sidebar-logo'>
					<div className='peers ai-c fxw-nw'>
						<div className='peer peer-greed'>
							<Link className='sidebar-link td-n' to={routes.LANDING}>
								<div className='peers ai-c fxw-nw'>
									<div className='peer'>
										<div className='logo d-flex align-items-center justify-content-center'>
											<img
												src='/assets/manifest-icon-192.png'
												alt='Paymento'
												className='border rounded-circle shadow-sm'
												style={{ height: '40px', width: '40px' }}
											/>
										</div>
									</div>
									<div className='peer peer-greed'>
										<h5 className='lh-1 mB-0 logo-text'>{APP_NAME}</h5>
									</div>
								</div>
							</Link>
						</div>
						<div className='peer'>
							<div className='mobile-toggle sidebar-toggle'>
								<a
									ref={sidebarToggleRef}
									href='/'
									className='td-n'
									onClick={(e) => {
										e.preventDefault();
										const classList = document.body.classList;
										if (classList.contains('is-collapsed')) {
											state.set('sidebar-collapsed', false);
											classList.remove('is-collapsed');
										} else {
											state.set('sidebar-collapsed', true);
											classList.add('is-collapsed');
										}
									}}>
									<i className='ti-arrow-circle-left'></i>
								</a>
							</div>
						</div>
					</div>
				</div>
				<ul className='sidebar-menu scrollable pos-r'>
					<li className='nav-item mT-30'>
						<Link className={`sidebar-link`} to={routes.DASHBOARD}>
							<span className={`icon-holder`}>
								<i className='c-blue-500 ti-home'></i>{' '}
							</span>
							<span className={`title`}>Dashboard</span>
						</Link>
					</li>
					{links
						.filter((link) => link.show)
						.map((link, index) => (
							<li className='nav-item' key={index}>
								<Link className={`sidebar-link`} to={link.url}>
									<span className='icon-holder'>
										<i className={`c-${colors[index]}-500 ${link.icon}`}></i>{' '}
									</span>
									<span className='title'>{link.title}</span>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
