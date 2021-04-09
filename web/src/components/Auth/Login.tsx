import React, { FC, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import bg from '../../assets/static/images/bg.jpg';
import logo from '../../assets/logo-full.svg';
import { APP_NAME } from '../../constants';
import { AuthContext } from '../../contexts';
import { useForm } from 'react-hook-form';
import { handleError } from '../../helpers';
import { State } from '../../libraries/State';
import axios from 'axios';

type Props = {};

type Inputs = {
	email: string;
	password: string;
};

const Login: FC<Props> = (props) => {
	const history = useHistory();

	const state = State.getInstance();

	const [remember, setRemember] = useState(state.get<boolean>('remember') === true ? true : false);
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit } = useForm<Inputs>();

	const { user, logged, setLogged, setUser } = useContext(AuthContext);

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post('/auth/login', data);

			setLogged(true);
			setUser(user);

			if (remember) {
				state.set('remember', true);
				state.set('user', user);
				state.set('token', token);
			} else {
				state.set('remember', false);
			}

			history.push(routes.DASHBOARD);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	if (logged && user) {
		history.push(routes.DASHBOARD);
	}

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
				<form onSubmit={handleSubmit(submit)}>
					<div className='form-group'>
						<label className='text-normal text-dark'>Email</label>
						<input
							ref={register}
							type='email'
							className='form-control'
							name='email'
							placeholder='email@example.com'
							disabled={processing}
						/>
					</div>
					<div className='form-group'>
						<label className='text-normal text-dark'>Password</label>
						<input
							ref={register}
							type='password'
							className='form-control'
							name='password'
							placeholder='Password'
							disabled={processing}
						/>
					</div>
					<div className='form-group'>
						<div className='peers ai-c jc-sb fxw-nw'>
							<div className='peer'>
								<div className='checkbox checkbox-circle checkbox-info peers ai-c'>
									<input
										type='checkbox'
										id='remember'
										name='remember'
										className='peer'
										checked={remember}
										onChange={() => setRemember(!remember)}
										disabled={processing}
									/>
									<label htmlFor='remember' className='peers peer-greed js-sb ai-c'>
										<span className='peer peer-greed'>Remember Me</span>
									</label>
								</div>
							</div>
							<div className='peer'>
								<button type='submit' className='btn btn-primary' disabled={processing}>
									{!processing ? 'Sign In' : <i className='material-icons spin-reverse'>loop</i>}
								</button>
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
