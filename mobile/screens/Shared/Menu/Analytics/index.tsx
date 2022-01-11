import axios from 'axios';
import React, { FC, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from '../../../../constants';
import { SessionPointContract } from '../../../../contracts/session-point.contract';
import { handleErrors } from '../../../../helpers';
import { useArray } from '../../../../hooks';
import haversine from 'haversine-distance';
import { SessionContract } from '../../../../contracts/session.contract';
import { flatten } from 'lodash';

type Props = {};

const Analytics: FC<Props> = (props) => {
	const [points, setPoints] = useArray<SessionPointContract>();
	const [sessions, setSessions] = useArray<SessionContract>();

	const fetch = async () => {
		await Promise.all([getPoints(), getSessions()]);
	};

	const getPoints = async () => {
		try {
			const { data } = await axios.get<SessionPointContract[]>('/sessions/points/all');
			setPoints(data);
		} catch (error) {
			handleErrors(error);
		}
	};

	const getSessions = async () => {
		try {
			const { data } = await axios.get<SessionContract[]>('/sessions/driver');
			setSessions(data);
		} catch (error) {
			handleErrors(error);
		}
	};

	const totalKms = useMemo(
		() =>
			points.reduce((prev, point, index, points) => {
				const next = points[index + 1];
				if (next) {
					return prev + haversine(point, next) / 1000;
				}
				return prev;
			}, 0),
		[points]
	);

	const passengers = useMemo(() => flatten(sessions.map((session) => session.passengers!)), [sessions]);

	useEffect(() => {
		fetch();
		// eslint-ignore-next-line
	}, []);

	return (
		<ScrollView style={{ backgroundColor: Colors.light, height: '100%' }}>
			<View style={{ paddingTop: 60, backgroundColor: Colors.light, height: '100%' }}>
				<Card>
					<Card.Title>Analytics</Card.Title>
					<Card.Divider />
					<View style={styles.row}>
						<Text style={styles.text}>Total KMs Travelled: {totalKms.toFixed(0)}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.text}>Total Passengers: {passengers.length}</Text>
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
