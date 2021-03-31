import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts';
import { routes } from '../../routes';
import styles from '../../styles/landing/navbar.module.scss';
import { AccountCircle } from '@material-ui/icons';

type Props = {};

const Navbar: FC<Props> = (props) => {
	const { logged, user } = useContext(AuthContext);

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
			<button className='navbar-toggler border-0' type='button' data-toggle='collapse' data-target='#navbar'>
				<i className='material-icons'>menu</i>
			</button>
			<div className='collapse navbar-collapse' id='navbar'>
				<ul className={`navbar-nav ml-auto`}>
					{!logged ? (
						<>
							<li className={`nav-item mx-2 ${styles['nav-item']}`}>
								<Link className={`nav-link ${styles.login}`} to={routes.LOGIN}>
									Sign In
								</Link>
							</li>
							<li className={`nav-item mx-2 ${styles['nav-item']}`}>
								<Link className={`nav-link ${styles.register}`} to={routes.REGISTER}>
									Sign Up
								</Link>
							</li>
						</>
					) : (
						<li className={`nav-item mx-2 ${styles['nav-item']}`}>
							<Link className={`nav-link d-flex align-items-center`} to={routes.DASHBOARD}>
								<AccountCircle className='mr-1' />
								{user?.firstName}
							</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
