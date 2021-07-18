import React, { FC, useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../routes';
import bg from '../../assets/static/images/bg.jpg';
import logo from '../../assets/logo-full.svg';
import { APP_NAME } from '../../constants';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import axios from 'axios';
import { handleError } from '../../helpers';
import { AuthContext } from '../../contexts';
import { cooperativeService } from '../../services/cooperative.service';
import { RolesEnum } from '../../contracts/user.contract';
import InputMask from 'react-input-mask';

type Props = {};

type Inputs = {
	firstName: string;
	lastName: string;
	address: string;
	email: string;
	phone: string;
	password: string;
	coins: number;
	role: RolesEnum;
	approved: boolean;
	cooperativeId: number;
};

const Register: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [role, setRole] = useState<RolesEnum | null>(null);
	const { register, handleSubmit } = useForm<Inputs>();
	const history = useHistory();

	const { logged } = useContext(AuthContext);

	const { data: cooperatives } = useQuery('cooperatives', () => cooperativeService.fetch());

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.role = role!;
			if (data.cooperativeId) {
				data.cooperativeId = Number(data.cooperativeId);
			}
			await axios.post('/auth/register', { ...data, context: 'web' });
			toastr.success(
				`Registered successfully. ${
					role !== RolesEnum.PASSENGER ? 'Please wait for approval' : 'Please login using the mobile app'
				}.`
			);
			if (role !== RolesEnum.PASSENGER) {
				history.push(routes.LOGIN);
			} else {
				history.push(routes.LANDING);
			}
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	if (logged) {
		history.push(routes.DASHBOARD);
	}

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
				<form onSubmit={handleSubmit(submit)}>
					{role === null ? (
						<div className='form-group'>
							<p className='lead'>I am a...</p>
							<div className='row'>
								<div className='col-12 col-md-auto my-2 text-center'>
									<button
										className='btn btn-info btn-sm'
										onClick={(e) => {
											e.preventDefault();
											setRole(RolesEnum.PASSENGER);
										}}>
										Passenger
										<i className='material-icons'>airline_seat_recline_normal</i>
									</button>
								</div>
								<div className='col-12 col-md-auto my-2 text-center'>
									<button
										className='btn btn-success btn-sm'
										onClick={(e) => {
											e.preventDefault();
											setRole(RolesEnum.DRIVER);
										}}>
										Driver
										<i className='material-icons'>assignment_ind</i>
									</button>
								</div>
								<div className='col-12 col-md-auto my-2 text-center'>
									<button
										className='btn btn-primary btn-sm'
										onClick={(e) => {
											e.preventDefault();
											if (cooperatives?.length === 0) {
												toastr.error(
													'There are no cooperatives yet. Cannot register as a cooperative owner.',
													'Oops!'
												);
												history.goBack();
											} else {
												setRole(RolesEnum.COOPERATIVE);
											}
										}}>
										Cooperative Owner
										<i className='material-icons'>supervisor_account</i>
									</button>
								</div>
								<div className='col-12 mt-4'>
									<small className='text-muted'>
										Note for Passengers: Please download the {APP_NAME} App on your phone and register.
									</small>
									<hr />
									<div className='row'>
										<a
											href='/sample-link-to-apk'
											className='d-flex align-items-center col-12 col-md-6'
											onClick={(e) => e.preventDefault()}>
											<i className='fab fa-android'></i>
											Download App (Android)
										</a>
										<a
											href='/sample-link-to-ios'
											className='d-flex align-items-center col-12 col-md-6'
											onClick={(e) => e.preventDefault()}>
											<i className='fab fa-apple'></i>
											Download App (iOS)
										</a>
									</div>
								</div>
							</div>
						</div>
					) : (
						<>
							<div className='row'>
								<div className='form-group col-12'>
									<p className='lead'>
										Selected: <b>{role}</b>
									</p>
									<button
										className='btn btn-info btn-sm'
										onClick={(e) => {
											e.preventDefault();
											setRole(null);
										}}>
										Reset
									</button>
								</div>
								<div className='form-group col-12 col-md-6'>
									<label className='text-normal text-dark'>First Name</label>
									<input
										{...register('firstName')}
										type='text'
										className='form-control'
										placeholder='First Name'
										disabled={processing}
									/>
								</div>
								<div className='form-group col-12 col-md-6'>
									<label className='text-normal text-dark'>Last Name</label>
									<input
										{...register('lastName')}
										type='text'
										className='form-control'
										placeholder='Last Name'
										disabled={processing}
									/>
								</div>
								<div className='form-group col-12 col-md-12'>
									<label className='text-normal text-dark'>Email</label>
									<input
										{...register('email')}
										type='email'
										className='form-control'
										placeholder='name@email.com'
										disabled={processing}
									/>
								</div>
								<div className='form-group col-12 col-md-6'>
									<label className='text-normal text-dark'>Address</label>
									<input
										{...register('address')}
										type='text'
										className='form-control'
										placeholder='Address'
										disabled={processing}
									/>
								</div>
								<div className='form-group col-12 col-md-6'>
									<label className='text-normal text-dark'>Phone</label>
									<InputMask
										mask='+639999999999'
										{...register('phone')}
										type='text'
										id='phone'
										placeholder='Phone Number'
										className='form-control'
										autoComplete='tel'
										disabled={processing}
									/>
								</div>
								{role !== 'Passenger' ? (
									<div className='form-group col-12'>
										<label className='text-normal text-dark'>Cooperative</label>
										<select
											{...register('cooperativeId')}
											className='form-control'
											disabled={processing || cooperatives?.length === 0}>
											<option value='' disabled selected>
												{' '}
												-- Select --{' '}
											</option>
											{cooperatives?.length === 0 ? (
												<option>No Cooperatives Available</option>
											) : (
												<option disabled selected>
													{' '}
													-- Select --{' '}
												</option>
											)}
											{cooperatives?.map((cooperative, index) => (
												<option value={cooperative.id} key={index}>
													{cooperative.name}
												</option>
											))}
										</select>
										<small className='form-text text-muted'>
											~ If you can't find your respective cooperative, please request it to a administrator.
										</small>
									</div>
								) : null}
								<div className='form-group col-12'>
									<label className='text-normal text-dark'>Password</label>
									<input
										{...register('password')}
										type='password'
										className='form-control'
										placeholder='Password'
										disabled={processing}
									/>
								</div>
							</div>
							<div className='form-group row'>
								<div className='col-12 col-md-4'>
									<button type='submit' className='btn btn-primary' disabled={processing}>
										{!processing ? 'Sign Up' : <i className='material-icons spin-reverse'>loop</i>}
									</button>
								</div>
								<div className='col-12 col-md-8 d-flex'>
									<Link to={routes.LOGIN} className='ml-md-auto mt-1'>
										Already have an account? Sign In
									</Link>
								</div>
							</div>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default Register;
