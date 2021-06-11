import dayjs from 'dayjs';
import React, { FC, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { RoleColorMap } from '../../../constants';
import { AuthContext } from '../../../contexts';
import { Asker, handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import { userService } from '../../../services/user.service';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('users', () => userService.fetch());

	const url = useURL();

	const { user: self } = useContext(AuthContext);

	if (isError) {
		handleError(error);
	}

	const approveUser = async (id: any) => {
		try {
			if (await Asker.notice('Are you sure you want to approve this user?')) {
				await userService.update(id, { approved: true });
				refetch();
				toastr.info('User has been approved.', 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	const deleteUser = async (id: any) => {
		try {
			if (await Asker.danger('Are you sure you want to delete this user?')) {
				await userService.delete(id);
				refetch();
				toastr.info('User has been deleted.', 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return (
		<Table
			title='Users'
			head={() => (
				<div className='d-flex'>
					<Link to={url('/add')} className='btn btn-info btn-sm mx-1 btn-icon' data-tip='Add User'>
						<i className='material-icons'>add</i>
					</Link>
					<button
						className='btn btn-primary btn-sm mx-1 btn-icon'
						disabled={isFetching || isLoading}
						data-tip='Refresh'
						onClick={(e) => {
							e.preventDefault();
							refetch();
						}}>
						<i className={`material-icons ${outIf(isFetching, 'spin-reverse')}`}>loop</i>
					</button>
				</div>
			)}
			columns={[
				{
					Header: 'ID',
					accessor: 'id',
				},
				{
					Header: 'First Name',
					accessor: 'firstName',
				},
				{
					Header: 'Last Name',
					accessor: 'lastName',
				},
				{
					Header: 'Email',
					accessor: 'email',
				},
				{
					Header: 'Phone',
					accessor: 'phone',
				},
				{
					Header: 'Approved',
					accessor: 'approved',
				},
				{
					Header: 'Role',
					accessor: 'role',
				},
				{
					Header: 'Cooperative',
					accessor: 'cooperative',
				},
				{
					Header: 'Issued',
					accessor: 'issued',
				},
				{
					Header: 'Actions',
					accessor: 'actions',
				},
			]}
			data={data?.map((user) => ({
				...user,
				approved: user.approved ? <span className='badge badge-success'>Yes</span> : <span className='badge badge-danger'>No</span>,
				role: <span className={`badge badge-${RoleColorMap[user.role]}`}>{user.role}</span>,
				issued: dayjs(user.createdAt).format('MMMM DD, YYYY hh:mm A'),
				cooperative: user.cooperative?.name || 'N/A',
				actions:
					self?.id !== user.id ? (
						<div className='d-flex'>
							{!user.approved ? (
								<button
									className='btn btn-success btn-sm btn-icon mx-1'
									data-tip='Approve User'
									onClick={(e) => {
										e.preventDefault();
										approveUser(user.id);
									}}>
									<i className='material-icons'>check</i>
								</button>
							) : null}
							<Link to={`${url(`/${user.id}/edit`)}`} className='btn btn-warning btn-sm btn-icon mx-1' data-tip='Edit User'>
								<i className='material-icons'>edit</i>
							</Link>
							<button
								className='btn btn-danger btn-sm btn-icon mx-1'
								data-tip='Delete User'
								onClick={(e) => {
									e.preventDefault();
									deleteUser(user.id);
								}}>
								<i className='material-icons'>clear</i>
							</button>
						</div>
					) : null,
			}))}
		/>
	);
};

export default List;
