import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { FC, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Divider, Icon, Image, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import Container from '../../components/Container';
import { Colors } from '../../constants';
import { AuthContext } from '../../contexts';
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
			navigation.navigate('Auth', {
				screen: 'Login',
			});
			Toast.show('Logged out successfully!', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
			await Promise.all([state.remove('user'), state.remove('token')]);
			setUser(null);
		}
	};

	return (
		<Container style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={require('../../assets/logo-full.png')} style={styles.image} />
				<Text>
					{user?.firstName} {user?.lastName}
				</Text>
				<Text>ID Number: #{`${user?.id}`.padStart(5, '0')}</Text>
			</View>
			<Divider style={{ backgroundColor: Colors.dark, height: 1, width: '75%', marginVertical: 12 }} />
			<View style={{ width: '75%' }}>
				{items.map((Item, index) => (
					<Item key={index} />
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
});

export default Menu;
