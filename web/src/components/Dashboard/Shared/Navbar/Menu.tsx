import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../../../constants';
import { AuthContext, EventContext, SocketContext } from '../../../../contexts';
import { Asker, outIf } from '../../../../helpers';
import { useURL } from '../../../../hooks';
import { State } from '../../../../libraries/State';
import { routes } from '../../../../routes';

type Props = {};

const Menu: FC<Props> = (props) => {
	const [show, setShow] = useState(false);
	const state = State.getInstance();

	const url = useURL();

	const { AuthBus } = useContext(EventContext);
	const { user } = useContext(AuthContext);
	const { setSocket, socket } = useContext(SocketContext);

	const logout = async (force: any) => {
		const prompt = force === 'force' ? true : await Asker.notice('Are you sure you want to logout?');
		if (prompt) {
			try {
				await axios.post('/auth/logout');
			} catch (error) {
				console.log((error as any).toJSON());
			} finally {
				state.remove('user').remove('token');
				socket?.disconnect();
				setSocket(null);
				toastr.info('Logged out successfully.', 'Notice');
				window.location.href = routes.LOGIN;
			}
		}
	};

	useEffect(() => {
		const key = AuthBus.listen('logout', (force) => logout(force));

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
					<img
						className='w-2r bdrs-50p'
						src={user?.picture ? `${SERVER_URL}${user.picture.url}` : 'https://randomuser.me/api/portraits/men/10.jpg'}
						alt='Profile'
						style={{
							width: '2rem',
							height: '2rem',
						}}
					/>
				</div>
				<div className='peer'>
					<span className='fsz-sm c-grey-900 hide-on-mobile'>{user?.firstName}</span>
				</div>
			</a>
			<ul className={`dropdown-menu fsz-sm ${outIf(show, 'show')}`}>
				<li>
					<Link to={url(routes.SETTINGS)} className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'>
						<i className='ti-settings mR-10'></i> <span>Settings</span>
					</Link>
				</li>
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
