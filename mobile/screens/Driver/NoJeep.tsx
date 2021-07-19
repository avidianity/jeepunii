import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Container from '../../components/Container';

type Props = {};

const NoJeep: FC<Props> = (props) => {
	return (
		<Container>
			<MaterialCommunityIcons name='jeepney' size={60} />
			<Text style={styles.headerText}>No Jeep Currently Assigned</Text>
			<Text style={styles.text}>The app will refresh automatically once you are assigned to a jeepney.</Text>
		</Container>
	);
};

const styles = StyleSheet.create({
	headerText: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},
	text: {
		textAlign: 'center',
		paddingHorizontal: 20,
	},
});

export default NoJeep;
