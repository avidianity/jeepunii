import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { RoleColorMap } from '../../../constants';
import { handleError } from '../../../helpers';
import { userService } from '../../../services/user.service';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error } = useQuery('users', () => userService.fetch());

	if (isError) {
		handleError(error);
	}

	return (
		<Table
			title='Users'
			loading={isLoading}
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
			]}
			data={data?.map((user) => ({
				...user,
				approved: user.approved ? <span className='badge badge-success'>Yes</span> : <span className='badge badge-danger'>No</span>,
				role: <span className={`badge badge-${RoleColorMap[user.role]}`}>{user.role}</span>,
			}))}
		/>
	);
};

export default List;
