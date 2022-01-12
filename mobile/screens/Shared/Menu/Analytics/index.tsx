import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../../../../constants';
import { SessionPointContract } from '../../../../contracts/session-point.contract';
import { handleErrors } from '../../../../helpers';
import { useArray, useNullable } from '../../../../hooks';
import haversine from 'haversine-distance';
import { JeepContext } from '../../../../contexts';
import { JeepContract } from '../../../../contracts/jeep.contract';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const [points, setPoints] = useArray<SessionPointContract>();
	const [handle, setHandle] = useNullable<NodeJS.Timer>();
	const { jeep } = useContext(JeepContext);
	const [passengers, setPassengers] = useState(0);

	const fetch = async () => {
		await Promise.all([getPoints(), getJeep()]);
	};

	const getPoints = async () => {
		try {
			const { data } = await axios.get<SessionPointContract[]>('/sessions/points/all');
			setPoints(data);
		} catch (error) {
			handleErrors(error);
		}
	};

	const getJeep = async () => {
		try {
			const { data } = await axios.get<JeepContract>(`/jeeps/${jeep?.id}`);
			setPassengers(
				(() => {
					const ids: number[] = [];

					data.passengers?.forEach((passenger) => {
						if (!ids.includes(passenger.passenger?.id!)) {
							ids.push(passenger.passenger?.id!);
						}
					});

					return ids.length;
				})()
			);
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
