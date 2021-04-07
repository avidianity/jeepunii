import React, { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import { cooperativeService } from '../../../services/cooperative.service';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('cooperatives', () => cooperativeService.fetch());

	const url = useURL();

	const approveCooperative = async (id: any) => {
		try {
			await cooperativeService.update(id, { approved: true });
			toastr.info('Cooperative has been approved', 'Notice');
			refetch();
		} catch (error) {
			handleError(error);
		}
	};

	if (isError) {
		handleError(error);
	}

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return (
		<Table
			title='Cooperatives'
			head={() => (
				<div className='d-flex'>
					<Link to={url('/add')} className='btn btn-info btn-sm mx-1 btn-icon' data-tip='Add Cooperative'>
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
					Header: 'Name',
					accessor: 'name',
				},
				{
					Header: 'Description',
					accessor: 'description',
				},
				{
					Header: 'Website',
					accessor: 'website',
				},
				{
					Header: 'Approved',
					accessor: 'approved',
				},
				{
					Header: 'Actions',
					accessor: 'actions',
				},
			]}
			data={data?.map((cooperative) => ({
				...cooperative,
				approved: cooperative.approved ? (
					<span className='badge badge-success'>Yes</span>
				) : (
					<span className='badge badge-danger'>No</span>
				),
				website: (
					<a href={cooperative.website} target='_blank' rel='noreferrer'>
						{cooperative.website}
					</a>
				),
				actions: (
					<div className='d-flex'>
						{!cooperative.approved ? (
							<button
								className='btn btn-info btn-sm btn-icon mx-1'
								data-tip='Approve Cooperative'
								onClick={(e) => {
									e.preventDefault();
									e.currentTarget.disable();
									approveCooperative(cooperative.id);
								}}>
								<i className='material-icons'>done</i>
							</button>
						) : null}
						<Link
							to={`${url(`/${cooperative.id}/edit`)}`}
							className='btn btn-warning btn-sm btn-icon mx-1'
							data-tip='Edit Cooperative'>
							<i className='material-icons'>edit</i>
						</Link>
						<button className='btn btn-danger btn-sm btn-icon mx-1' data-tip='Delete Cooperative'>
							<i className='material-icons'>clear</i>
						</button>
					</div>
				),
			}))}
		/>
	);
};

export default List;
