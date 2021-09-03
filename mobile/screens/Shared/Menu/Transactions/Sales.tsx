import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar, ListItem, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { SessionPassengerContract } from '../../../../contracts/session-passenger.contract';
import { useArray } from '../../../../hooks';

type Props = {};

const Sales: FC<Props> = (props) => {
	const [sales, setSales] = useArray<SessionPassengerContract>();

	const fetch = async () => {
		try {
			const { data } = await axios.get('/analytics/sales');
			setSales(data);
		} catch (error) {
			console.log(error);
			Toast.show('Unable to fetch sale analytics.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
		}
	};

	useEffect(() => {
		fetch();
		const handle = setInterval(() => fetch(), 15000);
		return () => {
			clearInterval(handle);
		};
		// eslint-disable-next-line
	}, []);

	const total = sales.reduce((prev, next) => prev + next.fee, 0);

	return (
		<View style={{ paddingTop: 20 }}>
			{sales.length === 0 ? (
				<Text h4 style={{ textAlign: 'center' }}>
					No Routes Available
				</Text>
			) : null}
			<Text>Total: ₱{Number.isInteger(total) ? total : total.toFixed(2)}</Text>
			{sales.map((sale, index) => (
				<ListItem key={index} bottomDivider>
					<Avatar source={{ uri: sale.passenger?.picture?.url || 'https://via.placeholder.com/200' }} />
					<ListItem.Content>
						<ListItem.Title>
							{sale.passenger?.lastName}, {sale.passenger?.firstName} - ₱{sale.fee}
						</ListItem.Title>
						<ListItem.Subtitle>{sale.location?.name}</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			))}
		</View>
	);
};

export default Sales;
