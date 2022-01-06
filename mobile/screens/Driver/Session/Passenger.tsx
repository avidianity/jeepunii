import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { Alert, Platform, StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { Image } from 'react-native-elements/dist/image/Image';
import { SERVER_URL } from '../../../constants';
import { SessionPointContract } from '../../../contracts/session-point.contract';
import { SessionContract } from '../../../contracts/session.contract';
import { calculateFromPoints, formatCurrency, handleErrors } from '../../../helpers';
import { useArray, useNullable } from '../../../hooks';
import { Passenger as PassengerContract } from '../Jeep';

const userImage = require('../../../assets/user.png');
const logoFull = require('../../../assets/logo-full.png');

type Props = {
	style?: StyleProp<ViewStyle>;
	passenger: PassengerContract;
	session: SessionContract;
	onEnd?: (id: number) => void;
};

const Passenger: FC<Props> = ({ style, passenger, session, onEnd }) => {
	const [points, setPoints] = useArray<SessionPointContract>();
	const user = passenger.data;
	const [handle, setHandle] = useNullable<NodeJS.Timer>();

	const getPoints = async () => {
		try {
			const { data } = await axios.get<SessionPointContract[]>(`/jeeps/passenger/${user.id}/${session.id}/points`);
			setPoints(data);
		} catch (error: any) {
			console.log(error.toObject ? error.toObject() : error);
		}
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
				<TouchableHighlight
					style={[styles.imageWrapper, passenger.online ? styles.online : styles.offline]}
					onPress={() => {
						if (user.anonymous) {
							Alert.alert("End Passenger's Session", 'Are you sure?', [
								{
									text: 'Confirm',
									onPress: () => {
										onEnd?.(user.id!);
									},
									style: 'default',
								},
								{
									text: 'Cancel',
									style: 'cancel',
								},
							]);
						}
					}}>
					<Image
						source={
							user.picture && !user.anonymous
								? {
										uri: `${SERVER_URL}${user.picture.url}`,
								  }
								: user.anonymous
								? userImage
								: logoFull
						}
						style={styles.image}
					/>
				</TouchableHighlight>
			</View>
			<Text style={styles.text}>
				{user.firstName} {formatCurrency(calculateFromPoints(points))}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
		height: '100%',
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
		marginTop: 2,
	},
});

export default Passenger;
