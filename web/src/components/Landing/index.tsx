import React, { FC } from 'react';
import Navbar from './Navbar';
import intro from '../../assets/intro.png';
import { routes } from '../../routes';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

type Props = {};

const Landing: FC<Props> = (props) => {
	return (
		<div>
			<Navbar />
			<div className='mt-5 container'>
				<div className='row'>
					<div className='col-12 col-md-6 d-flex'>
						<div className='align-self-center'>
							<h1 className='display-4'>{APP_NAME}</h1>
							<p className='lead'>
								{APP_NAME} is a Service as a Platform that allows commuters to pay jeepney fares by scanning the QR code.
								Commuters are able to transfer funds to add to their wallet balance in order to pay fares.
							</p>
							<Link className='btn btn-primary' to={routes.LOGIN}>
								<i className='ti-medall'></i>
								Get Started
							</Link>
						</div>
					</div>
					<div className='col-md-6 d-none d-md-block'>
						<img src={intro} alt='Intro' className='img-fluid' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
