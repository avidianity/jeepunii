import React, { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useRouteMatch } from 'react-router';
import { AuthContext } from '../../../contexts';
import { CooperativeContract } from '../../../contracts/cooperative.contract';
import { handleError } from '../../../helpers';
import { useMode } from '../../../hooks';
import { cooperativeService } from '../../../services/cooperative.service';
import Card from '../../Shared/Card';

type Props = {};

const Form: FC<Props> = (props) => {
	const [mode, setMode] = useMode();
	const [processing, setProcessing] = useState(false);
	const { register, setValue, handleSubmit } = useForm<CooperativeContract>();
	const history = useHistory();
	const match = useRouteMatch<{ cooperativeID: string }>();

	const id = match.params.cooperativeID;

	const { user } = useContext(AuthContext);

	const fetchCooperative = async (id: any) => {
		setProcessing(true);
		try {
			const user = await cooperativeService.fetchOne(id);
			for (const [key, value] of Object.entries(user)) {
				setValue(key, value);
			}
			setProcessing(false);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	const submit = async (payload: CooperativeContract) => {
		setProcessing(true);
		try {
			payload.approved = user?.role === 'Admin';
			if (mode === 'Add') {
				await cooperativeService.create(payload);
			} else {
				await cooperativeService.update(id, payload);
			}
			toastr.success('Cooperative saved successfully.');
		} catch (error) {
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		if (match.path.includes('edit')) {
			setMode('Edit');
			fetchCooperative(id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className='container'>
			<Card title={`${mode} Cooperative`}>
				<form className='mt-4' onSubmit={handleSubmit(submit)}>
					<div className='form-row'>
						<div className='form-group col- col-md-6'>
							<label htmlFor='name'>Name</label>
							<input
								ref={register}
								type='text'
								name='name'
								id='name'
								placeholder='Name'
								className='form-control'
								disabled={processing}
							/>
						</div>
						<div className='form-group col-12 col-md-6'>
							<label htmlFor='website'>Website</label>
							<input
								ref={register}
								type='text'
								name='website'
								id='website'
								placeholder='Website'
								className='form-control'
								disabled={processing}
								autoComplete='url'
							/>
						</div>
						<div className='form-group col-12'>
							<label htmlFor='description'>Description</label>
							<textarea
								ref={register}
								name='description'
								id='description'
								placeholder='Description'
								className='form-control'
								disabled={processing}></textarea>
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
