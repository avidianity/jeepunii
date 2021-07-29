import dayjs from 'dayjs';
import pluralize from 'pluralize';
import React, { FC, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { RoleColorMap } from '../../../constants';
import { AuthContext } from '../../../contexts';
import { RolesEnum, UserContract } from '../../../contracts/user.contract';
import { Asker, formatCurrency, handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import { userService } from '../../../services/user.service';
import Table from '../../Shared/Table';

interface Props extends RouteComponentProps {
	type: RolesEnum;
}

const List: FC<Props> = ({ type }) => {
	const plural = pluralize(type);
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery(plural.toLowerCase(), () =>
		userService.fetch({ role: type })
	);

	const url = useURL();

	const { user: self } = useContext(AuthContext);

	if (isError) {
		handleError(error);
	}

	const approveUser = async (id: any) => {
		try {
			if (await Asker.notice(`Are you sure you want to approve this ${type}?`)) {
				await userService.update(id, { approved: true });
				refetch();
				toastr.info(`${type} has been approved.`, 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	const deleteUser = async (id: any) => {
		try {
			if (await Asker.danger(`'Are you sure you want to delete this ${type}?'`)) {
				await userService.delete(id);
				refetch();
				toastr.info(`${type} has been deleted.`, 'Notice');
			}
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	const columns = getColumnMap(type, self!);

	return (
		<Table
			title={plural}
			head={() => (
				<div className='d-flex'>
					<Link to={url('/add')} className='btn btn-info btn-sm mr-1 btn-icon ml-auto' data-tip={`Add ${type}`}>
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
			columns={columns}
			data={data?.map((user) => ({
				...user,
				approved: user.approved ? <span className='badge badge-success'>Yes</span> : <span className='badge badge-danger'>No</span>,
				role: <span className={`badge badge-${RoleColorMap[user.role]}`}>{user.role}</span>,
				issued: dayjs(user.createdAt).format('MMMM DD, YYYY hh:mm A'),
				cooperative: user.cooperative?.name || 'N/A',
				coins: formatCurrency(user.coins),
				riding: user.riding ? <span className='badge badge-success'>Yes</span> : <span className='badge badge-info'>No</span>,
				jeep: user.jeep?.name || 'N/A',
				actions:
					self?.id !== user.id ? (
						<div className='d-flex'>
							{!user.approved ? (
								type !== RolesEnum.PASSENGER ? (
									<button
										className='btn btn-success btn-sm btn-icon mx-1'
										data-tip={`Approve ${type}`}
										onClick={(e) => {
											e.preventDefault();
											approveUser(user.id);
										}}>
										<i className='material-icons'>check</i>
									</button>
								) : (
									<Link
										className='btn btn-success btn-sm btn-icon mx-1'
										data-tip={`Verify ${type}`}
										to={url(`/${user.id}/verify`)}>
										<i className='material-icons'>verified</i>
									</Link>
								)
							) : null}
							<Link
								to={`${url(`/${user.id}/edit`)}`}
								className='btn btn-warning btn-sm btn-icon mx-1'
								data-tip={`Edit ${type}`}>
								<i className='material-icons'>edit</i>
							</Link>
							<button
								className='btn btn-danger btn-sm btn-icon mx-1'
								data-tip={`Delete ${type}`}
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

function getColumnMap(type: RolesEnum, self: UserContract) {
	switch (type) {
		case RolesEnum.ADMIN:
			return [
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
					Header: 'Issued',
					accessor: 'issued',
				},
				{
					Header: 'Actions',
					accessor: 'actions',
				},
			];
		case RolesEnum.COOPERATIVE:
			return (() => {
				const columns = [
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
						Header: 'Issued',
						accessor: 'issued',
					},
					{
						Header: 'Actions',
						accessor: 'actions',
					},
				];

				if (self.role === RolesEnum.ADMIN) {
					columns.splice(5, 0, {
						Header: 'Cooperative',
						accessor: 'cooperative',
					});
				}

				return columns;
			})();
		case RolesEnum.DRIVER:
			return (() => {
				const columns = [
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
						Header: 'Jeep',
						accessor: 'jeep',
					},
					{
						Header: 'Approved',
						accessor: 'approved',
					},
					{
						Header: 'Issued',
						accessor: 'issued',
					},
					{
						Header: 'Actions',
						accessor: 'actions',
					},
				];

				if (self.role === RolesEnum.ADMIN) {
					columns.splice(5, 0, {
						Header: 'Cooperative',
						accessor: 'cooperative',
					});
				}

				return columns;
			})();
		case RolesEnum.PASSENGER:
			return [
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
					Header: 'Credits',
					accessor: 'coins',
				},
				{
					Header: 'Riding',
					accessor: 'riding',
				},
				{
					Header: 'Issued',
					accessor: 'issued',
				},
				{
					Header: 'Actions',
					accessor: 'actions',
				},
			];
	}
}

export default List;
