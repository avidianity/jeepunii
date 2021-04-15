import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { Roles } from '../../../constants';
import { AuthContext } from '../../../contexts';
import { RolesEnum, UserContract } from '../../../contracts/user.contract';
import { handleError } from '../../../helpers';
import { useMode } from '../../../hooks';
import { cooperativeService } from '../../../services/cooperative.service';
import { userService } from '../../../services/user.service';
import Card from '../../Shared/Card';

type Props = {};

const Form: FC<Props> = (props) => {
	const [mode, setMode] = useMode();
	const [processing, setProcessing] = useState(false);
	const { register, setValue, handleSubmit } = useForm<UserContract>();

	const { user } = useContext(AuthContext);

	const [disableCooperative, setDisableCooperative] = useState(['Admin', 'Passenger'].includes(user?.role || ''));
	const { data: cooperatives, refetch: fetchCooperatives } = useQuery('cooperatives', () => cooperativeService.fetch());
	const history = useHistory();
	const match = useRouteMatch<{ userID: string }>();

	const id = match.params.userID;

	const fetchUser = async (id: any) => {
		setProcessing(true);
		try {
			const user = await userService.fetchOne(id);
			for (const [key, value] of Object.entries(user)) {
				setValue(key, value);
			}

			if (user.role !== 'Admin') {
				setDisableCooperative(false);
			}

			setProcessing(false);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (payload: UserContract) => {
		setProcessing(true);
		try {
			payload.approved = user?.role === 'Admin';
			if (mode === 'Add') {
				await userService.create(payload);
			} else {
				await userService.update(id, payload);
			}
			toastr.success('User saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchUser(id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<Card title={`${mode} User`}>
				<form className='mt-4' onSubmit={handleSubmit(submit)}>
					<div className='form-row'>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='firstName'>First Name</label>
							<input
								ref={register}
								type='text'
								name='firstName'
								id='firstName'
								placeholder='First Name'
								className='form-control'
								autoComplete='given-name'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='lastName'>Last Name</label>
							<input
								ref={register}
								type='text'
								name='lastName'
								id='lastName'
								placeholder='Last Name'
								className='form-control'
								autoComplete='family-name'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='address'>Address</label>
							<input
								ref={register}
								type='text'
								name='address'
								id='address'
								placeholder='Address'
								className='form-control'
								autoComplete='street-address'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='email'>Email</label>
							<input
								ref={register}
								type='email'
								name='email'
								id='email'
								placeholder='Email'
								className='form-control'
								autoComplete='email'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='phone'>Phone Number</label>
							<input
								ref={register}
								type='text'
								name='phone'
								id='phone'
								placeholder='Phone Number'
								className='form-control'
								autoComplete='tel'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='password'>Password</label>
							<input
								ref={register}
								type='password'
								name='password'
								id='password'
								placeholder='Password'
								className='form-control'
								autoComplete='password'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-4'>
							<label htmlFor='role'>Role</label>
							<select
								ref={register}
								name='role'
								id='role'
								className='form-control'
								onChange={(e) => {
									if ([RolesEnum.COOPERATIVE, RolesEnum.DRIVER].includes(e.target.value as RolesEnum)) {
										setDisableCooperative(false);
										fetchCooperatives();
									} else {
										setDisableCooperative(true);
									}
								}}
								disabled={processing}>
								{Roles.filter((role) =>
									user?.role === 'Admin' ? true : [RolesEnum.COOPERATIVE, RolesEnum.DRIVER].includes(role)
								).map((role, index) => (
									<option value={role} key={index}>
										{role}
									</option>
								))}
							</select>
						</div>
						<div className='form-group col-12 col-md-4'>
							<label htmlFor='cooperativeId'>Cooperative</label>
							<select
								ref={register}
								name='cooperativeId'
								id='cooperativeId'
								className='form-control'
								disabled={processing || disableCooperative}>
								{user?.role === 'Admin' ? (
									cooperatives?.map((cooperative, index) => (
										<option value={cooperative.id} key={index}>
											{cooperative.name}
										</option>
									))
								) : (
									<option value={user?.cooperative?.id}>{user?.cooperative?.name}</option>
								)}
							</select>
						</div>
						<div className='form-group col-12'>
							<button type='submit' className='btn btn-primary btn-sm'>
								{!processing ? 'Save' : <i className='material-icons spin-reverse'>loop</i>}
							</button>
						</div>
					</div>
				</form>
			</Card>
		</div>
	);
};

export default Form;
