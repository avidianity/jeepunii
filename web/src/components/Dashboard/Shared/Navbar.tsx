import React, { createRef, FC, useEffect } from 'react';
import { State } from '../../../libraries/State';
import Menu from './Navbar/Menu';
import Messages from './Navbar/Messages';
import Notifications from './Navbar/Notifications';

type Props = {};

const Navbar: FC<Props> = (props) => {
	const sidebarToggleRef = createRef<HTMLAnchorElement>();
	const state = State.getInstance();

	useEffect(() => {
		if (state.get('sidebar-collapsed')) {
			document.body.classList.add('is-collapsed');
		}
		if (sidebarToggleRef.current) {
			sidebarToggleRef.current.onclick = null;
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='header navbar'>
			<div className='header-container'>
				<ul className='nav-left'>
					<li>
						<a
							ref={sidebarToggleRef}
							id='sidebar-toggle'
							className='sidebar-toggle'
							href='/'
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
							<i className='ti-menu'></i>
						</a>
					</li>
					<li className='search-box'>
						<a className='search-toggle no-pdd-right' href='/'>
							<i className='search-icon ti-search pdd-right-10'></i>
							<i className='search-icon-close ti-close pdd-right-10'></i>
						</a>
					</li>
					<li className='search-input'>
						<input className='form-control' type='text' placeholder='Search...' />
					</li>
				</ul>
				<ul className='nav-right'>
					<Notifications />
					<Messages />
					<Menu />
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
