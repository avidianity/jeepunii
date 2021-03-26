import React, { FC, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import bg from '../../assets/static/images/bg.jpg';
import logo from '../../assets/logo-full.svg';
import { APP_NAME } from '../../constants';
import { EventContext } from '../../contexts';

type Props = {};

const Login: FC<Props> = (props) => {
	const history = useHistory();

	const { AuthBus } = useContext(EventContext);

	return (
		<div className='peers ai-s fxw-nw h-100vh'>
			<div className='d-n@sm- peer peer-greed h-100 pos-r bgr-n bgpX-c bgpY-c bgsz-cv' style={{ backgroundImage: `url(${bg})` }}>
				<div className='pos-a centerXY'>
					<div className='bgc-white bdrs-50p pos-r' style={{ width: '120px', height: '120px' }}>
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
				<h4 className='fw-300 c-grey-900 mB-40'>Welcome back!</h4>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						AuthBus.dispatch('login');
						history.push(routes.DASHBOARD);
					}}>
					<div className='form-group'>
						<label className='text-normal text-dark'>Username</label>
						<input type='email' className='form-control' placeholder='John Doe' />
					</div>
					<div className='form-group'>
						<label className='text-normal text-dark'>Password</label>
						<input type='password' className='form-control' placeholder='Password' />
					</div>
					<div className='form-group'>
						<div className='peers ai-c jc-sb fxw-nw'>
							<div className='peer'>
								<div className='checkbox checkbox-circle checkbox-info peers ai-c'>
									<input type='checkbox' id='remember' name='remember' className='peer' />
									<label htmlFor='remember' className='peers peer-greed js-sb ai-c'>
										<span className='peer peer-greed'>Remember Me</span>
									</label>
								</div>
							</div>
							<div className='peer'>
								<button className='btn btn-primary'>Sign In</button>
							</div>
						</div>
					</div>
					<div className='form-group'>
						<Link to={routes.REGISTER}>Don't have an account? Sign Up</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
