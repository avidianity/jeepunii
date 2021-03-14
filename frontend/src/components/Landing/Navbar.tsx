import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import styles from '../../styles/landing/navbar.module.scss';

type Props = {};

const Navbar: FC<Props> = (props) => {
	console.log(styles);
	return (
		<nav className={`navbar navbar-expand-lg navbar-light bg-white shadow px-4 py-3`}>
			<Link className={`navbar-brand d-flex align-items-center ${styles.brand}`} to={routes.LANDING}>
				<img
					src='/assets/manifest-icon-192.png'
					style={{ height: '40px', width: '40px' }}
					className='mr-2 rounded-circle border shadow-sm'
					alt='Logo'
				/>
				Paymento
			</Link>
			<button
				className='navbar-toggler'
				type='button'
				data-toggle='collapse'
				data-target='#navbarSupportedContent'
				aria-controls='navbarSupportedContent'
				aria-expanded='false'
				aria-label='Toggle navigation'>
				<span className='navbar-toggler-icon'></span>
			</button>

			<div className='collapse navbar-collapse' id='navbarSupportedContent'>
				<ul className={`navbar-nav ml-auto`}>
					<li className='nav-item mx-2'>
						<Link className={`nav-link ${styles['nav-link']} ${styles.login}`} to={routes.LOGIN}>
							Sign In
						</Link>
					</li>
					<li className='nav-item mx-2'>
						<Link className={`nav-link ${styles['nav-link']} ${styles.register}`} to={routes.REGISTER}>
							Sign Up
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
