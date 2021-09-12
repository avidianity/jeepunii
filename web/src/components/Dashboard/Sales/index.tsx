import React, { FC } from 'react';
import Card from '../../Shared/Card';
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
	BarChart,
	Legend,
	Bar,
} from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';
import { LocationContract } from '../../../contracts/location.contract';
import { jeepService } from '../../../services/jeep.service';
import { SessionPassengerContract } from '../../../contracts/session-passenger.contract';

type Sale = SessionPassengerContract & {
	month: string;
	year: string;
};

type Props = {};

const Sales: FC<Props> = (props) => {
	const { data: routes } = useQuery('top-routes', async () => {
		const { data } = await axios.get<LocationContract[]>('/analytics/top-routes');
		return data;
	});
	const { data: jeeps } = useQuery('jeeps', () => jeepService.analytics());
	const { data: saleData } = useQuery('sales', async () => {
		const { data } = await axios.get<{ monthly: Sale[], yearly: Sale[] }>('/analytics/sales');
		return [
			...data.monthly.map(session => {
				return {
					month: session?.month,
					year: session?.year,
					sale: sessions.reduce((previous, current) => {
						return previous + current.fee;
					}, 0),
				};
			}),
			...data.monthly.map(session => {
				return {
					month: session?.month,
					year: session?.year,
					sale: sessions.reduce((previous, current) => {
						return previous + current.fee;
					}, 0),
				};
			}),
		];
	});

	return (
		<div className='container-fluid'>
			<Card title='Sales'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-12 w-100' style={{ minHeight: '300px' }}>
							<ResponsiveContainer>
								<LineChart
									data={routes}
									margin={{
										top: 10,
										right: 30,
										left: 0,
										bottom: 0,
									}}>
									<Line type='monotone' dataKey='stops' stroke='#8884d8' />
									<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip />
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className='col-12 w-100' style={{ minHeight: '300px' }}>
							<ResponsiveContainer>
								<BarChart
									data={jeeps?.map((jeep) => ({
										...jeep,
										passengers: jeep.passengers?.length || 0,
									}))}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey='passengers' fill='#8884d8' />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className='col-12 w-100' style={{ minHeight: '300px' }}>
							<ResponsiveContainer>
								<AreaChart
									data={sales}
									margin={{
										top: 10,
										right: 30,
										left: 0,
										bottom: 0,
									}}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='month' />
									<YAxis />
									<Tooltip />
									<Area label='$' type='monotone' dataKey='sale' stroke='#8884d8' fill='#8884d8' />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default Sales;
