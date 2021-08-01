import React, { FC } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';
import { Image } from 'react-native-elements/dist/image/Image';
import { SERVER_URL } from '../../../constants';
import { Passenger as PassengerContract } from '../Jeep';

type Props = {
	style?: StyleProp<ViewStyle>;
	passenger: PassengerContract;
};

const Passenger: FC<Props> = ({ style, passenger }) => {
	const user = passenger.data;

	return (
		<View style={style}>
			<View style={styles.imageContainer}>
				<View style={styles.imageWrapper}>
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
				</View>
			</View>
			<Text>
				{user.lastName}, {user.firstName} ({passenger.online ? 'ol' : 'of'})
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
	},
});

export default Passenger;
