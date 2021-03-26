import React, { FC, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import bg from '../../assets/static/images/bg.jpg';
import logo from '../../assets/logo-full.svg';
import { APP_NAME } from '../../constants';

type Props = {};

const Register: FC<Props> = (props) => {
	const history = useHistory();

	return (
		<div className='peers ai-s fxw-nw h-100vh'>
			<div className='peer peer-greed h-100 pos-r bgr-n bgpX-c bgpY-c bgsz-cv' style={{ backgroundImage: `url(${bg})` }}>
				<div className='pos-a centerXY'>
					<div className='bgc-white bdrs-50p pos-r' style={{ height: '120px', width: '120px' }}>
						<img
							className='pos-a centerXY rounded-circle'
							src={logo}
							alt={APP_NAME}
							style={{ width: '100px', height: '100px' }}
						/>
					</div>
				</div>
			</div>
			<div className='col-12 col-md-4 peer pX-40 pY-80 h-100 bgc-white scrollable pos-r' style={{ minWidth: '320px' }}>
				<h4 className='fw-300 c-grey-900 mB-40'>Hi! Thanks for reaching out to us!</h4>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						toastr.success('Registered successfully!', undefined, { extendedTimeOut: 99999 });
					}}>
					<div className='form-group'>
						<label className='text-normal text-dark'>Username</label>
						<input type='text' className='form-control' placeholder='John Doe' />
					</div>
					<div className='form-group'>
						<label className='text-normal text-dark'>Email Address</label>
						<input type='email' className='form-control' placeholder='name@email.com' />
					</div>
					<div className='form-group'>
						<label className='text-normal text-dark'>Password</label>
						<input type='password' className='form-control' placeholder='Password' />
					</div>
					<div className='form-group'>
						<label className='text-normal text-dark'>Confirm Password</label>
						<input type='password' className='form-control' placeholder='Confirm Password' />
					</div>
					<div className='form-group row'>
						<div className='col-12 col-md-4'>
							<button className='btn btn-primary'>Sign Up</button>
						</div>
						<div className='col-12 col-md-8 d-flex'>
							<Link to={routes.LOGIN} className='ml-md-auto mt-1'>
								Already have an account? Sign In
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
