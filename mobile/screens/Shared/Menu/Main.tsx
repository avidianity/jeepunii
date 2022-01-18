import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, TouchableHighlight } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Image, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import Container from '../../../components/Container';
import { Colors, SERVER_URL } from '../../../constants';
import { AuthContext, NetContext } from '../../../contexts';
import { RolesEnum, UserContract } from '../../../contracts/user.contract';
import { State } from '../../../libraries/State';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { formatCurrency, handleErrors } from '../../../helpers';

type Props = {};

const Main: FC<Props> = (props) => {
	const state = useMemo(() => State.getInstance(), []);

	const navigation = useNavigation();

	const { user, setUser } = useContext(AuthContext);
	const { online } = useContext(NetContext);
	const [coins, setCoins] = useState(user?.coins || 0);

	const items = [
		() => (
			<Button
				icon={<Icon name='attach-money' type='material' color='#fff' />}
				title='Transactions'
				onPress={() => navigation.navigate('Transactions')}
			/>
		),
		() => <Button icon={<Icon name='logout' type='material' color='#fff' />} title='Logout' onPress={() => logout()} />,
	];

	const logout = async () => {
		try {
			await axios.post('/auth/logout');
		} catch (error: any) {
			console.log(error.toJSON());
		} finally {
			await Promise.all([state.remove('user'), state.remove('token')]);
			Toast.show('Logged out successfully!', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
			navigation.navigate('Auth', {
				screen: 'Login',
			});
			setUser(null);
		}
	};

	const pick = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== ImagePicker.PermissionStatus.GRANTED) {
			return Toast.show('Please grant camera permissions.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
				shadow: true,
				animation: true,
				hideOnPress: true,
			});
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
		});

		if (!result.cancelled) {
			save(result);
		}
	};

	const save = async (image: ImageInfo) => {
		try {
			const form = new FormData();

			const filename = image.uri.split('/').pop()!;

			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : `image`;

			form.append('file', { uri: image.uri, name: filename, type } as any);

			const { data: user } = await axios.post<UserContract>('/auth/picture', form);

			await state.set('user', user);
			setUser(user);

			Toast.show('Profile picture changed successfully.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
		} catch (error) {
			handleErrors(error);
		}
	};

	const checkCoins = async () => {
		try {
			const token = await state.get('token');
			const { data } = await axios.get('/auth/check', { headers: `Bearer ${token}` });
			setCoins(data.coins);
		} catch (_) {}
	};

	useEffect(() => {
		checkCoins();
	}, []);

	return (
		<Container style={styles.container}>
			<View style={styles.imageContainer}>
				<TouchableHighlight style={[styles.imageWrapper, online ? styles.online : styles.offline]}>
					<Image
						source={
							user?.picture
								? {
										uri: `${SERVER_URL}${user.picture.url}`,
								  }
								: require('../../../assets/logo-full.png')
						}
						style={styles.image}
						onPress={() => pick()}
					/>
				</TouchableHighlight>
				<Text>
					{user?.firstName} {user?.lastName}
				</Text>
				{user?.role === RolesEnum.DRIVER ? <Text>{user?.cooperative?.name}</Text> : null}
				{user?.role === RolesEnum.PASSENGER ? <Text>₱{coins}</Text> : null}
				<Text>ID Number: #{`${user?.id}`.padStart(5, '0')}</Text>
			</View>
			<Divider style={{ backgroundColor: Colors.dark, height: 1, width: '75%', marginVertical: 12 }} />
			<View style={{ width: '75%' }}>
				{items.map((Item, index) => (
					<View style={styles.item} key={index}>
						<Item />
					</View>
				))}
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,
	},
	imageContainer: {
		alignItems: 'center',
	},
	image: {
		height: 120,
		width: 120,
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
		marginTop: 40,
	},
	item: {
		marginVertical: 4,
	},
	online: {
		borderColor: 'green',
	},
	offline: {
		borderColor: 'rgb(60, 60, 60)',
	},
});

export default Main;
