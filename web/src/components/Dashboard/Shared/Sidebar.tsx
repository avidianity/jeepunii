import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../constants';
import { AuthContext } from '../../../contexts';
import { RolesEnum } from '../../../contracts/user.contract';
import { useURL } from '../../../hooks';
import { State } from '../../../libraries/State';
import { routes } from '../../../routes';

type Props = {};

type RouteLink = {
	url: string;
	icon: string;
	title: string;
	show: boolean;
	text?: string;
};

const colors = [
	'brown',
	'deep-orange',
	'deep-purple',
	'indigo',
	'light-blue',
	'pink',
	'purple',
	'red',
	'teal',
	'blue',
	'green',
	'black',
	'white',
];

const Sidebar: FC<Props> = (props) => {
	const url = useURL();
	const state = State.getInstance();

	const { user } = useContext(AuthContext);

	const role = user?.role!;

	const links: RouteLink[] = [
		{
			url: url(routes.ADMINS),
			icon: 'material-icons',
			title: 'Administrators',
			show: [RolesEnum.ADMIN].includes(role),
			text: 'admin_panel_settings',
		},
		{
			url: url(routes.OWNERS),
			icon: 'material-icons',
			title: 'Cooperative Owners',
			show: [RolesEnum.ADMIN, RolesEnum.COOPERATIVE].includes(role),
			text: 'supervised_user_circle',
		},
		{
			url: url(routes.DRIVERS),
			icon: 'material-icons',
			title: 'Drivers',
			show: [RolesEnum.ADMIN, RolesEnum.COOPERATIVE].includes(role),
			text: 'sports_motorsports',
		},
		{
			url: url(routes.PASSENGERS),
			icon: 'material-icons',
			title: 'Passengers',
			show: [RolesEnum.ADMIN, RolesEnum.COOPERATIVE, RolesEnum.DRIVER].includes(role),
			text: 'person_off',
		},
		{
			url: url(routes.JEEPS),
			icon: 'ti-car',
			title: 'Jeeps',
			show: role !== RolesEnum.PASSENGER,
		},
		{
			url: url(routes.COOPERATIVES),
			icon: 'ti-clipboard',
			title: 'Cooperatives',
			show: role === RolesEnum.ADMIN,
		},
		{
			url: url(routes.SALES),
			icon: 'ti-money',
			title: 'Analytics',
			show: ![RolesEnum.PASSENGER].includes(role),
		},
		{
			url: url(routes.LOGS),
			icon: 'ti-time',
			title: 'Logs',
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
										<h5 className='lh-1 mB-0 logo-text ml-1'>{APP_NAME}</h5>
									</div>
								</div>
							</Link>
						</div>
						<div className='peer'>
							<div className='mobile-toggle sidebar-toggle'>
								<a
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
					{links
						.filter((link) => link.show)
						.map((link, index) => (
							<li className='nav-item' key={index}>
								<Link className={`sidebar-link`} to={link.url}>
									<span className='icon-holder'>
										<i className={`c-${colors[index]}-500 ${link.icon}`}>{link.text}</i>{' '}
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
