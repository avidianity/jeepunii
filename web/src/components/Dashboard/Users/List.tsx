import dayjs from 'dayjs';
import React, { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { RoleColorMap } from '../../../constants';
import { handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import { userService } from '../../../services/user.service';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('users', () => userService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

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
				actions: (
					<div className='d-flex'>
						<Link to={`${url(`/${user.id}/edit`)}`} className='btn btn-warning btn-sm btn-icon mx-1' data-tip='Edit User'>
							<i className='material-icons'>edit</i>
						</Link>
						<button className='btn btn-danger btn-sm btn-icon mx-1' data-tip='Delete User'>
							<i className='material-icons'>clear</i>
						</button>
					</div>
				),
			}))}
		/>
	);
};

export default List;
