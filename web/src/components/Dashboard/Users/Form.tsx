import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { AuthContext } from '../../../contexts';
import { RolesEnum } from '../../../contracts/user.contract';
import { handleError } from '../../../helpers';
import { useMode } from '../../../hooks';
import { cooperativeService } from '../../../services/cooperative.service';
import { userService } from '../../../services/user.service';
import Card from '../../Shared/Card';
import InputMask from 'react-input-mask';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {
	type: RolesEnum;
}

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
	riding: boolean;
};

const Form: FC<Props> = ({ type }) => {
	const [mode, setMode] = useMode();
	const [processing, setProcessing] = useState(false);
	const { register, setValue, handleSubmit } = useForm<Inputs>({
		defaultValues: {
			coins: 0,
		},
	});

	const { user } = useContext(AuthContext);

	const [disableCooperative, setDisableCooperative] = useState(
		[RolesEnum.ADMIN, RolesEnum.PASSENGER].includes(type) || user?.role !== RolesEnum.ADMIN
	);
	const { data: cooperatives } = useQuery('cooperatives', () => cooperativeService.fetch());
	const history = useHistory();
	const match = useRouteMatch<{ userID: string }>();

	const id = match.params.userID;

	const fetchUser = async (id: any) => {
		setProcessing(true);
		try {
			const editable = await userService.fetchOne(id, { role: type });
			for (const [key, value] of Object.entries(editable)) {
				setValue(key as any, value);
			}

			if (editable.cooperative) {
				setValue('cooperativeId', editable.cooperative.id!);
			}

			if (editable.role !== RolesEnum.ADMIN && user?.role === RolesEnum.ADMIN) {
				setDisableCooperative(false);
			}

			setProcessing(false);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (payload: Inputs) => {
		setProcessing(true);
		try {
			payload.approved = [RolesEnum.ADMIN, RolesEnum.COOPERATIVE].includes(user?.role!);
			payload.role = type;
			if (payload.coins) {
				payload.coins = Number(payload.coins);
			}
			if (mode === 'Add') {
				await userService.create(payload);
			} else {
				await userService.update(id, payload);
			}
			toastr.success(`${payload.role} saved successfully.`);
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
			<Card title={`${mode} ${type}`}>
				<button
					className='btn btn-warning btn-sm'
					onClick={(e) => {
						e.preventDefault();
						history.goBack();
					}}>
					Back
				</button>
				<form className='mt-4' onSubmit={handleSubmit(submit)}>
					<div className='form-row'>
						<div className='form-group col-12 col-md-6 col-lg-3'>
							<label htmlFor='firstName'>First Name</label>
							<input
								{...register('firstName')}
								type='text'
								id='firstName'
								placeholder='First Name'
								className='form-control'
								autoComplete='given-name'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-3'>
							<label htmlFor='lastName'>Last Name</label>
							<input
								{...register('lastName')}
								type='text'
								id='lastName'
								placeholder='Last Name'
								className='form-control'
								autoComplete='family-name'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-3'>
							<label htmlFor='address'>Address</label>
							<input
								{...register('address')}
								type='text'
								id='address'
								placeholder='Address'
								className='form-control'
								autoComplete='street-address'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6 col-lg-3'>
							<label htmlFor='email'>Email</label>
							<input
								{...register('email')}
								type='email'
								id='email'
								placeholder='Email'
								className='form-control'
								autoComplete='email'
								disabled={processing}
							/>
						</div>
						<div className={`form-group col-12 col-md-6 ${type === RolesEnum.PASSENGER ? 'col-lg-4' : ''}`}>
							<label htmlFor='phone'>Phone Number</label>
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
						<div className={`form-group col-12 col-md-6 ${type === RolesEnum.PASSENGER ? 'col-lg-4' : ''}`}>
							<label htmlFor='password'>Password</label>
							<input
								{...register('password')}
								type='password'
								id='password'
								placeholder='Password'
								className='form-control'
								autoComplete='password'
								disabled={processing}
							/>
						</div>
						{type === RolesEnum.PASSENGER ? (
							<div className='form-group col-12 col-md-4 col-lg-4'>
								<label htmlFor='coins'>Credits</label>
								<input
									{...register('coins')}
									type='coins'
									id='coins'
									placeholder='Credits'
									className='form-control'
									disabled={processing}
								/>
							</div>
						) : null}
						{!disableCooperative && type !== RolesEnum.PASSENGER ? (
							<div className='form-group col-12'>
								<label htmlFor='cooperativeId'>Cooperative</label>
								<select {...register('cooperativeId')} id='cooperativeId' className='form-control' disabled={processing}>
									{user?.role === RolesEnum.ADMIN ? (
										<option disabled selected>
											{' '}
											-- Select --{' '}
										</option>
									) : null}
									{user?.role === RolesEnum.ADMIN ? (
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
						) : null}
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
