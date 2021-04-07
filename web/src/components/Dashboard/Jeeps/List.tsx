import React, { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import { jeepService } from '../../../services/jeep.service';
import QRModal from '../../Shared/QRModal';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('jeeps', () => jeepService.fetch());

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return (
		<Table
			title='Jeeps'
			head={() => (
				<div className='d-flex'>
					<Link to={url('/add')} className='btn btn-info btn-sm mx-1 btn-icon' data-tip='Add Jeep'>
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
					Header: 'Plate Number',
					accessor: 'plateNumber',
				},
				{
					Header: 'Cooperative',
					accessor: 'cooperative',
				},
				{
					Header: 'Driver (Last Assigned / Current)',
					accessor: 'driver',
				},
				{
					Header: 'Actions',
					accessor: 'actions',
				},
			]}
			data={data?.map((jeep) => ({
				...jeep,
				cooperative: jeep.cooperative?.name,
				driver: jeep.driver ? `${jeep.driver.lastName}, ${jeep.driver.firstName}` : 'N/A',
				actions: (
					<div className='d-flex'>
						<QRModal
							url={`/jeeps/${jeep.id}/crypto`}
							title={<i className='material-icons'>qr_code</i>}
							buttonClassName='btn btn-info btn-sm btn-icon mx-1'
							props={{ 'data-tip': 'View QR Code' }}
							modalTitle={`${jeep.name} - ${jeep.plateNumber}`}
						/>
						<Link to={`${url(`/${jeep.id}/edit`)}`} className='btn btn-warning btn-sm btn-icon mx-1' data-tip='Edit Jeep'>
							<i className='material-icons'>edit</i>
						</Link>
						<button className='btn btn-danger btn-sm btn-icon mx-1' data-tip='Delete Jeep'>
							<i className='material-icons'>clear</i>
						</button>
					</div>
				),
			}))}
		/>
	);
};

export default List;
