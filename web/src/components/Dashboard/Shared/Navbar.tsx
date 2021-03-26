import React, { FC } from 'react';
import Menu from './Navbar/Menu';
import Messages from './Navbar/Messages';
import Notifications from './Navbar/Notifications';

type Props = {};

const Navbar: FC<Props> = (props) => {
	return (
		<div className='header navbar'>
			<div className='header-container'>
				<ul className='nav-left'>
					<li>
						<a id='sidebar-toggle' className='sidebar-toggle' href='javascript:void(0);'>
							<i className='ti-menu'></i>
						</a>
					</li>
					<li className='search-box'>
						<a className='search-toggle no-pdd-right' href='javascript:void(0);'>
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
