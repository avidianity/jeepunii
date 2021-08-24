import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { LocationContract } from '../../../contracts/location.contract';
import { handleError, outIf } from '../../../helpers';
import { useURL } from '../../../hooks';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('routes', async () => {
		const { data } = await axios.get<LocationContract[]>('/locations');
		return data;
	});

	const url = useURL();

	if (isError) {
		handleError(error);
	}

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return (
		<>
			<Table
				title='Routes'
				head={() => (
					<div className='d-flex'>
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
						accessor: 'place_id',
					},
					{
						Header: 'Name',
						accessor: 'name',
					},
					{
						Header: 'Road',
						accessor: 'address_road',
					},
					{
						Header: 'City District',
						accessor: 'address_city_district',
					},
					{
						Header: 'State',
						accessor: 'address_state',
					},
					{
						Header: 'Actions',
						accessor: 'actions',
					},
				]}
				data={data?.map((location) => ({
					...location,
					actions: (
						<div className='d-flex'>
							<Link to={url(`/${location.id}/view`)} className='btn btn-info btn-sm btn-icon mx-1' data-tip={`View Map`}>
								<i className='material-icons'>location_on</i>
							</Link>
						</div>
					),
				}))}
			/>
		</>
	);
};

export default List;
