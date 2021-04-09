import dayjs from 'dayjs';
import React, { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import ReactTooltip from 'react-tooltip';
import { handleError, outIf } from '../../../helpers';
import { logService } from '../../../services/log.service';
import Table from '../../Shared/Table';

type Props = {};

const List: FC<Props> = (props) => {
	const { data, isLoading, isError, error, refetch, isFetching } = useQuery('logs', () => logService.fetch());

	if (isError) {
		handleError(error);
	}

	useEffect(() => {
		ReactTooltip.rebuild();
	});

	return (
		<Table
			title='Logs'
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
					accessor: 'id',
				},
				{
					Header: 'Message',
					accessor: 'message',
				},
				{
					Header: 'Identifiable',
					accessor: 'identifiable',
				},
				{
					Header: 'Level',
					accessor: 'level',
				},
				{
					Header: 'Issued',
					accessor: 'issued',
				},
			]}
			data={data?.map((log) => ({
				...log,
				issued: dayjs(log.createdAt).format('MMMM DD, YYYY hh:mm A'),
			}))}
		/>
	);
};

export default List;
