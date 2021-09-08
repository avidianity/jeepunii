import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Container from '../../components/Container';
import { LocationContract } from '../../contracts/location.contract';
import { SessionPassengerContract } from '../../contracts/session-passenger.contract';
import { formatCurrency } from '../../helpers';
import { useNullable } from '../../hooks';

type Props = {
	session: SessionPassengerContract;
	done: () => void;
};

const Done: FC<Props> = ({ session, done }) => {
	const [start, setStart] = useNullable<LocationContract>();

	const fetch = async () => {
		const { data } = await axios.post('/locations/info', {
			lat: session.start_lat,
			lon: session.start_lon,
		});
		setStart(data);
	};

	useEffect(() => {
		fetch();
		// eslint-disable-next-line
	}, []);

	return (
		<Container style={{ paddingTop: 80, paddingHorizontal: 4 }}>
			<Text style={styles.heading}>RECEIPT</Text>
			<Text>Start: {start?.name}</Text>
			<Text>Stop: {session?.location?.name}</Text>
			<Text>Amount: {formatCurrency(session?.fee || 0)}</Text>
			<Text>Ref: {session?.uuid}</Text>
			<Button
				title='Done'
				onPress={() => {
					done();
				}}
			/>
		</Container>
	);
};

const styles = StyleSheet.create({
	heading: {
		fontSize: 20,
	},
});

export default Done;
