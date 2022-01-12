import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../../../../constants';
import { SessionPointContract } from '../../../../contracts/session-point.contract';
import { handleErrors } from '../../../../helpers';
import { useArray, useNullable } from '../../../../hooks';
import haversine from 'haversine-distance';
import { SessionContract } from '../../../../contracts/session.contract';
import { flatten } from 'lodash';
import { SessionPassengerContract } from '../../../../contracts/session-passenger.contract';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const [points, setPoints] = useArray<SessionPointContract>();
	const [sessions, setSessions] = useArray<SessionContract>();
	const [handle, setHandle] = useNullable<NodeJS.Timer>();
	const [sales, setSales] = useArray<SessionPassengerContract>();

	const fetch = async () => {
		await Promise.all([getPoints(), getSales()]);
	};

	const getPoints = async () => {
		try {
			const { data } = await axios.get<SessionPointContract[]>('/sessions/points/all');
			setPoints(data);
		} catch (error) {
			handleErrors(error);
		}
	};

	const getSales = async () => {
		try {
			const { data } = await axios.get('/analytics/sales');
			setSales(data);
		} catch (error) {
			console.log(error);
		}
	};

	const totalMeters = points.reduce((prev, point, index, points) => {
		const next = points[index + 1];
		if (next) {
			return prev + haversine(point, next);
		}
		return prev;
	}, 0);

	const passengers = (() => {
		const ids: number[] = [];

		sales.forEach((sale) => {
			if (!ids.includes(sale.passenger?.id!)) {
				ids.push(sale.passenger?.id!);
			}
		});

		return ids.length;
	})();

	useEffect(() => {
		fetch();

		setHandle(setInterval(() => fetch(), 5000));

		return () => {
			if (handle) {
				clearInterval(handle);
			}
		};
		// eslint-ignore-next-line
	}, []);

	return (
		<ScrollView style={{ backgroundColor: Colors.light, height: '100%' }}>
			<View style={{ paddingTop: 60, backgroundColor: Colors.light, height: '100%' }}>
				<Card>
					<Card.Title>Analytics</Card.Title>
					<Card.Divider />
					<View style={styles.row}>
						<Text style={styles.text}>Total KMs Travelled: {totalMeters.toFixed(0).toNumber() / 1000}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.text}>Total Passengers: {passengers}</Text>
					</View>
				</Card>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		marginBottom: 6,
	},
	text: {
		fontSize: 16,
	},
});

export default Analytics;
