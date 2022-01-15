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
import { JeepContract } from '../../../contracts/jeep.contract';
import { SessionPointContract } from '../../../contracts/session-point.contract';
import { calculateDistanceFromPoints } from '../../../helpers';

type Props = {};

type ByMonthResponse = {
	jeep: JeepContract;
	points: {
		month: string;
		data: SessionPointContract[];
	}[];
}[];

const Sales: FC<Props> = (props) => {
	const { data: routes } = useQuery('top-routes', async () => {
		const { data } = await axios.get<LocationContract[]>('/analytics/top-routes');
		return data;
	});
	const { data: jeeps } = useQuery('jeeps', () => jeepService.analytics());
	const { data: sales } = useQuery('sales', async () => {
		const { data } = await axios.get<SessionPassengerContract[]>('/analytics/sales');
		return data;
	});
	const { data: byMonths } = useQuery('by-months', async () => {
		const { data } = await axios.get<ByMonthResponse>('/sessions/points/by-month');

		return data;
	});

	return (
		<div className='container-fluid'>
			<Card title='Analytics'>
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
										passengers: (() => {
											const ids: number[] = [];

											jeep.passengers?.forEach((passenger) => {
												if (!ids.includes(passenger.passenger?.id!)) {
													ids.push(passenger.passenger?.id!);
												}
											});

											return ids.length;
										})(),
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
			<Card title='Jeeps by KMs'>
				<div className='row'>
					{byMonths?.map(({ jeep, points }, index) => (
						<div key={index} className='p-2 col-12 col-md-6 col-lg-4'>
							<div className='card'>
								<div className='card-header'>
									<div className='card-title'>{jeep.name}</div>
								</div>
								<div className='card-body'>
									<ul className='list-group'>
										{points.map(({ month, data }, index) => (
											<li className='list-group-item' key={index}>
												{month}: {calculateDistanceFromPoints(data)}kms
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
};

export default Sales;
