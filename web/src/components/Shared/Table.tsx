import React from 'react';
import { useTable } from 'react-table';
import { outIf, toBool } from '../../helpers';
import { State } from '../../libraries/State';
import Card from './Card';

type Props<T> = {
	title: string;
	columns: Array<{ Header: string; accessor: keyof T }>;
	data?: T[];
	head?: () => JSX.Element | JSX.Element[];
};

const Table = function <T>({ title, columns, data, head }: Props<T>) {
	const state = State.getInstance();

	const table = useTable({
		columns: columns as any,
		data: (data || []) as any,
	});

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table;

	return (
		<div className='container-fluid'>
			<Card title={title}>
				{rows.length === 0 ? <p>No Data</p> : null}
				{head ? head() : null}
				<div className={`table-responsive ${outIf(toBool(head), 'mt-2')}`}>
					<table className={`table table-bordered ${outIf(state.get<boolean>('table-sm'), 'table-sm')}`} {...getTableProps()}>
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
			</Card>
		</div>
	);
};

export default Table;
