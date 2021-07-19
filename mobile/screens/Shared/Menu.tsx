import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import React, { FC, useContext, useMemo } from 'react';
import { Platform } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Image, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import Container from '../../components/Container';
import { Colors } from '../../constants';
import { AuthContext } from '../../contexts';
import { RolesEnum } from '../../contracts/user.contract';
import { State } from '../../libraries/State';

type Props = {};

const Menu: FC<Props> = (props) => {
	const state = useMemo(() => State.getInstance(), []);

	const navigation = useNavigation();

	const { user, setUser } = useContext(AuthContext);

	const items = [() => <Button icon={<Icon name='logout' type='material' color='#fff' />} title='Logout' onPress={() => logout()} />];

	const logout = async () => {
		try {
			await axios.post('/auth/logout');
		} catch (error) {
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

	return (
		<Container style={styles.container}>
			<View style={styles.imageContainer}>
				<View style={styles.imageWrapper}>
					<Image source={require('../../assets/logo-full.png')} style={styles.image} />
				</View>
				<Text>
					{user?.firstName} {user?.lastName}
				</Text>
				{user?.role === RolesEnum.DRIVER ? <Text>{user?.cooperative?.name}</Text> : null}
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
	item: {
		marginVertical: 4,
	},
});

export default Menu;
