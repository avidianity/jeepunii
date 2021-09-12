import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

	const total = sales.reduce((prev, next) => prev + Number(next.fee), 0);

	return (
		<View style={{ paddingTop: 20 }}>
			{sales.length === 0 ? (
				<Text h4 style={{ textAlign: 'center' }}>
					No Routes Available
				</Text>
			) : null}
			<Text style={{ paddingLeft: 16 }}>Total: ₱{Number.isInteger(total) ? total : total.toFixed(2)}</Text>
			<FlatList
				keyExtractor={(_, index) => index.toString()}
				data={sales}
				contentContainerStyle={styles.list}
				renderItem={({ item: sale }) => (
					<ListItem bottomDivider>
						<Avatar rounded source={{ uri: sale.passenger?.picture?.url || 'https://via.placeholder.com/200' }} />
						<ListItem.Content>
							<ListItem.Title>
								{sale.passenger?.lastName}, {sale.passenger?.firstName} - ₱
								{Number.isInteger(sale.fee) ? sale.fee : Number(sale.fee).toFixed(2)}
							</ListItem.Title>
							<ListItem.Subtitle>{sale.location?.name}</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		paddingBottom: 18,
	},
});

export default Sales;
