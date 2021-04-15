import { useNavigation } from '@react-navigation/core';
import React, { FC, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthContext } from '../contexts';
import { UserContract } from '../contracts/user.contract';
import { State } from '../libraries/State';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../params/RootStack.params';
import { Image } from 'react-native-elements';
import axios from 'axios';

type Props = {};

type ScreenProps = StackNavigationProp<RootStackParams, 'Splash'>;

const Splash: FC<Props> = (props) => {
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation<ScreenProps>();

	const { setUser, user } = useContext(AuthContext);

	const state = State.getInstance();

	const getCache = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		if (!user) {
			const hasUser = await state.has('user');
			if (hasUser) {
				setUser(await state.get<UserContract>('user'));
			}
			if (await state.has('token')) {
				const token = await state.get<string>('token');
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}

			if (hasUser) {
				setLoading(false);
				return setTimeout(() => navigation.push('Home'), 500);
			}
		}

		setLoading(false);
		setTimeout(() => navigation.push(user ? 'Home' : 'Auth'), 500);
	};

	useEffect(() => {
		getCache();
	}, []);

	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/logo-full.png')}
				PlaceholderContent={<ActivityIndicator />}
				style={styles.logo}
				onPress={getCache}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 100,
		backgroundColor: 'white',
	},
	logo: {
		height: 240,
		width: 240,
	},
});

export default Splash;
