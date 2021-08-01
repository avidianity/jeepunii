import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { AuthContext } from '../../../contexts';
import { RolesEnum } from '../../../contracts/user.contract';
import { handleError } from '../../../helpers';
import { useMode } from '../../../hooks';
import { cooperativeService } from '../../../services/cooperative.service';
import { jeepService } from '../../../services/jeep.service';
import { userService } from '../../../services/user.service';
import Card from '../../Shared/Card';

type Props = {};

type Inputs = {
	name: string;
	plateNumber: string;
	cooperativeId: number;
	driverId: number;
};

const Form: FC<Props> = (props) => {
	const [mode, setMode] = useMode();
	const [processing, setProcessing] = useState(false);
	const [assignDriver, setAssignDriver] = useState(false);
	const { register, setValue, handleSubmit } = useForm<Inputs>();
	const history = useHistory();
	const match = useRouteMatch<{ jeepID: string }>();

	const id = match.params.jeepID;

	const { user } = useContext(AuthContext);

	const { data: cooperatives } = useQuery('cooperatives', () => cooperativeService.fetch());

	const driverParams: { [key: string]: any } = { role: 'Driver' };

	if (user?.role !== 'Admin') {
		driverParams.cooperativeId = user?.cooperative?.id;
	}

	const { data: drivers } = useQuery('drivers', () => userService.fetch(driverParams));

	const fetchJeep = async (id: any) => {
		setProcessing(true);
		try {
			const jeep = await jeepService.fetchOne(id);
			for (const [key, value] of Object.entries(jeep)) {
				setValue(key as any, value);
			}

			if (jeep.cooperative) {
				setValue('cooperativeId', jeep.cooperative.id!);
			}

			if (jeep.driver) {
				setAssignDriver(true);
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
			if (user?.role !== 'Admin') {
				payload.cooperativeId = user?.cooperative?.id!;
			}

			if (mode === 'Add') {
				await jeepService.create(payload);
			} else {
				await jeepService.update(id, payload);
			}
			toastr.success('Jeep saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchJeep(id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<Card title={`${mode} Jeep`}>
				<form className='mt-4' onSubmit={handleSubmit(submit)}>
					<div className='form-row'>
						<div className='form-group col- col-md-6'>
							<label htmlFor='name'>Name</label>
							<input
								{...register('name')}
								type='text'
								id='name'
								placeholder='Name'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='plateNumber'>Plate Number</label>
							<input
								{...register('plateNumber')}
								type='text'
								id='plateNumber'
								placeholder='Plate Number'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='cooperativeId'>Cooperative</label>
							<select
								{...register('cooperativeId')}
								id='cooperativeId'
								placeholder='Cooperative'
								className='form-control'
								disabled={processing || user?.role !== 'Admin'}>
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
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='driverId'>Driver</label>
							<select
								{...register('driverId')}
								id='driverId'
								placeholder='Driver'
								className='form-control'
								disabled={processing || !assignDriver}>
								{assignDriver ? (
									<option disabled selected>
										{' '}
										-- Select --{' '}
									</option>
								) : null}
								{assignDriver ? (
									drivers?.map((driver, index) => (
										<option value={driver.id} key={index}>
											{`${driver.lastName}, ${driver.firstName}`}
										</option>
									))
								) : (
									<option>...</option>
								)}
							</select>
							<div className='form-check mt-1'>
								<label className='form-check-label'>
									<input
										className='form-check-input'
										type='checkbox'
										checked={assignDriver}
										onChange={() => setAssignDriver(!assignDriver)}
									/>{' '}
									Assign a Driver
								</label>
							</div>
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
