import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';
import Menu from './Shared/Menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Travel from './Passenger/Travel';
import DriverHome from './Driver/Home';
import { useContext } from 'react';
import { AuthContext } from '../contexts';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { RolesEnum } from '../contracts/user.contract';

type Props = {};

const Tab = createBottomTabNavigator();

const Home: FC<Props> = (props) => {
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();

	useEffect(() => {
		if (!user) {
			navigation.navigate('Auth', {
				screen: 'Login',
			});
		}
	}, [user, navigation]);

	if (!user) {
		return null;
	}

	return (
		<Tab.Navigator
			initialRouteName={user.role === RolesEnum.PASSENGER ? 'Travel' : 'Home'}
			tabBarOptions={{ activeTintColor: Colors.light, activeBackgroundColor: Colors.primary }}>
			{user.role === RolesEnum.DRIVER ? (
				<Tab.Screen
					name='Home'
					component={DriverHome}
					options={{
						tabBarLabel: 'Home',
						tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='home' color={color} size={size} />,
					}}
				/>
			) : null}
			{user.role === RolesEnum.PASSENGER ? (
				<Tab.Screen
					name='Travel'
					component={Travel}
					options={{
						tabBarLabel: 'Travel',
						tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='car' color={color} size={size} />,
					}}
				/>
			) : null}
			<Tab.Screen
				name='Menu'
				component={Menu}
				options={{
					tabBarLabel: 'Menu',
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='menu' color={color} size={size} />,
				}}
			/>
		</Tab.Navigator>
	);
};

export default Home;
