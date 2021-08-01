import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Container from '../../../components/Container';
import { SessionContract } from '../../../contracts/session.contract';
import { Passenger as PassengerContract } from '../Jeep';
import Passenger from './Passenger';

type Props = {
	session: SessionContract;
	stop: () => void;
	passengers: PassengerContract[];
};

const Current: FC<Props> = ({ stop, passengers }) => {
	return (
		<Container>
			<Button
				title='Stop Driving'
				icon={<Icon name='logout' type='material' color='#fff' />}
				onPress={() => {
					if (passengers.length === 0) {
						Alert.alert('Stop Driving', 'Are you sure you want to stop driving?', [
							{
								text: 'Confirm',
								style: 'default',
								onPress: stop,
							},
							{
								text: 'Cancel',
								style: 'cancel',
							},
						]);
					}
				}}
				disabled={passengers.length > 0}
			/>
			<View style={styles.list}>
				{passengers.map((passenger, index) => (
					<Passenger passenger={passenger} key={index} style={styles.item} />
				))}
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		marginTop: 10,
	},
	item: {
		width: '50%',
		paddingHorizontal: 2,
	},
});

export default Current;
