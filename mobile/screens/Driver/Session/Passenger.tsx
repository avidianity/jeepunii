import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { Platform, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { Image } from 'react-native-elements/dist/image/Image';
import { SERVER_URL } from '../../../constants';
import { SessionPointContract } from '../../../contracts/session-point.contract';
import { SessionContract } from '../../../contracts/session.contract';
import { calculateFromPoints } from '../../../helpers';
import { useArray, useNullable } from '../../../hooks';
import { Passenger as PassengerContract } from '../Jeep';

type Props = {
	style?: StyleProp<ViewStyle>;
	passenger: PassengerContract;
	session: SessionContract;
};

const Passenger: FC<Props> = ({ style, passenger, session }) => {
	const [points, setPoints] = useArray<SessionPointContract>();
	const user = passenger.data;
	const [handle, setHandle] = useNullable<NodeJS.Timer>();

	const getPoints = async () => {
		const { data } = await axios.get<SessionPointContract[]>(`/passenger/${user.id}/${session.id}/points`);
		setPoints(data);
	};

	useEffect(() => {
		setHandle(setInterval(getPoints, 30000));
		return () => {
			if (handle) {
				clearInterval(handle);
			}
		};
		// eslint-disable-next-line
	}, []);

	return (
		<View style={style}>
			<View style={styles.imageContainer}>
				<TouchableHighlight style={[styles.imageWrapper, passenger.online ? styles.online : styles.offline]}>
					<Image
						source={
							user?.picture
								? {
										uri: `${SERVER_URL}${user.picture.url}`,
								  }
								: require('../../../assets/logo-full.png')
						}
						style={styles.image}
					/>
				</TouchableHighlight>
			</View>
			<Text style={styles.text}>
				{user.firstName} ₱{calculateFromPoints(points)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
	},
	image: {
		height: 70,
		width: 70,
		borderRadius: 150,
	},
	imageWrapper: {
		...Platform.select({
			ios: {
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.1,
				shadowRadius: 2,
				shadowColor: 'rgb(40, 40, 40)',
			},
			android: {
				elevation: 5,
			},
		}),
		borderRadius: 150,
		marginBottom: 10,
		borderWidth: 1,
	},
	online: {
		borderColor: 'green',
	},
	offline: {
		borderColor: 'rgb(60, 60, 60)',
	},
	text: {
		textAlign: 'center',
	},
});

export default Passenger;
