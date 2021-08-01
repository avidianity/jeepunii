import axios from 'axios';
import React, { FC } from 'react';
import { createRef } from 'react';
import { useContext } from 'react';
import { SERVER_URL } from '../../../constants';
import { AuthContext } from '../../../contexts';
import { UserContract } from '../../../contracts/user.contract';
import { handleError } from '../../../helpers';
import { State } from '../../../libraries/State';
import Card from '../../Shared/Card';

type Props = {};

const Settings: FC<Props> = (props) => {
	const state = State.getInstance();
	const { user, setUser } = useContext(AuthContext);
	const fileRef = createRef<HTMLInputElement>();
	const formRef = createRef<HTMLFormElement>();

	const save = async (file: File) => {
		const form = new FormData();

		form.append('file', file);

		try {
			const { data: user } = await axios.post<UserContract>('/auth/picture', form);
			state.set('user', user);
			setUser(user);
			toastr.info('Profile picture changed successfully.', 'Notice');
		} catch (error) {
			handleError(error);
		} finally {
			formRef.current?.reset();
		}
	};

	return (
		<div className='container-fluid'>
			<Card title='Settings'>
				<div className='text-center'>
					<form ref={formRef}>
						<input
							ref={fileRef}
							type='file'
							className='d-none'
							onChange={(e) => {
								if (e.target.files && e.target.files.length > 0) {
									save(e.target.files[0]);
								}
							}}
						/>
					</form>
					<img
						src={user?.picture ? `${SERVER_URL}${user.picture.url}` : 'https://via.placeholder.com/300'}
						alt={user?.firstName || 'Profile'}
						style={{
							height: '250px',
							width: '250px',
						}}
						className='rounded-circle shadow border d-inline mx-auto clickable'
						onClick={(e) => {
							e.preventDefault();
							fileRef.current?.click();
						}}
					/>
					<p className='mt-3'>
						{user?.lastName}, {user?.firstName}
					</p>
					<p>{user?.address}</p>
					<p>{user?.phone}</p>
				</div>
			</Card>
		</div>
	);
};

export default Settings;
