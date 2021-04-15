import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';
import Menu from './Shared/Menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Travel from './Passenger/Travel';

type Props = {};

const Tab = createBottomTabNavigator();

const Home: FC<Props> = (props) => {
	return (
		<Tab.Navigator initialRouteName='Travel' tabBarOptions={{ activeTintColor: Colors.light, activeBackgroundColor: Colors.primary }}>
			<Tab.Screen
				name='Travel'
				component={Travel}
				options={{
					tabBarLabel: 'Travel',
					tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name='car' color={color} size={size} />,
				}}
			/>
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
