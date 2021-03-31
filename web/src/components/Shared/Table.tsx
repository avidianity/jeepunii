import React, { FC } from 'react';
import { useTable } from 'react-table';
import Loading from './Loading';

type Props = {
	title: string;
	columns: Array<{ Header: string; accessor: string }>;
	data?: any[];
	loading: boolean;
};

const Table: FC<Props> = ({ title, columns, data, loading }) => {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns: columns,
		data: data || [],
	});

	if (loading) {
		return <Loading className='mt-2' />;
	}

	return (
		<div className='container-fluid'>
			<div className='bgc-white bd bdrs-3 p-20 mB-20'>
				<h4 className='c-grey-900 mB-20'>{title}</h4>
				{rows.length === 0 ? <p>No Data</p> : null}
				<div className='table-responsive'>
					<table className='table table-bordered' {...getTableProps()}>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => (
										<th {...column.getHeaderProps()}>{column.render('Header')}</th>
									))}
								</tr>
							))}
						</thead>
						<tbody {...getTableBodyProps()}>
							{rows.map((row) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => {
											return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Table;
