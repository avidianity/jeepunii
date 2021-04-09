import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, EventContext } from '../../../../contexts';
import { outIf } from '../../../../helpers';
import { State } from '../../../../libraries/State';
import { routes } from '../../../../routes';

type Props = {};

const Menu: FC<Props> = (props) => {
	const [show, setShow] = useState(false);
	const state = State.getInstance();

	const { AuthBus } = useContext(EventContext);
	const { user } = useContext(AuthContext);

	const logout = async () => {
		state.remove('user').remove('token');

		try {
			await axios.post('/auth/logout');
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			toastr.info('Logged out successfully.', 'Notice');
			window.location.href = routes.LOGIN;
		}
	};

	useEffect(() => {
		const key = AuthBus.listen('logout', () => logout());

		return () => {
			AuthBus.unlisten(key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<li className={`dropdown ${outIf(show, 'show')}`}>
			<a
				href='/'
				className='dropdown-toggle no-after peers fxw-nw ai-c lh-1'
				onClick={(e) => {
					e.preventDefault();
					setShow(!show);
				}}>
				<div className='peer mR-10'>
					<img className='w-2r bdrs-50p' src='https://randomuser.me/api/portraits/men/10.jpg' alt='Profile' />
				</div>
				<div className='peer'>
					<span className='fsz-sm c-grey-900 hide-on-mobile'>{user?.firstName}</span>
				</div>
			</a>
			<ul className={`dropdown-menu fsz-sm ${outIf(show, 'show')}`}>
				<li>
					<a href='/' className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'>
						<i className='ti-user mR-10'></i> <span>Profile</span>
					</a>
				</li>
				<li>
					<Link to={routes.SETTINGS} className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'>
						<i className='ti-settings mR-10'></i> <span>Settings</span>
					</Link>
				</li>
				<li role='separator' className='divider'></li>
				<li>
					<a
						href='/'
						className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'
						onClick={(e) => {
							e.preventDefault();
							logout();
						}}>
						<i className='ti-power-off mR-10'></i> <span>Logout</span>
					</a>
				</li>
			</ul>
		</li>
	);
};

export default Menu;
