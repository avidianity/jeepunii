import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Colors } from '../constants';
import Menu from './Shared/Menu';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Travel from './Passenger/Travel';
import DriverHome from './Driver/Home';
import { useContext } from 'react';
import { AuthContext, NetContext } from '../contexts';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { RolesEnum } from '../contracts/user.contract';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';

type Props = {};

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const Home: FC<Props> = (props) => {
	const { user } = useContext(AuthContext);
	const navigation = useNavigation();

	const { online } = useContext(NetContext);

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

	const MenuNavigator: any = user.role === RolesEnum.DRIVER ? Drawer : Tab;

	if (!online) {
		return (
			<View style={styles.center}>
				<Text style={styles.text}>You are offline. Please turn on your mobile data to use the app.</Text>
			</View>
		);
	}

	return (
		<MenuNavigator.Navigator
			initialRouteName={user.role === RolesEnum.PASSENGER ? 'Travel' : 'Home'}
			{...(user.role === RolesEnum.PASSENGER
				? { tabBarOptions: { activeTintColor: Colors.light, activeBackgroundColor: Colors.primary } }
				: {})}>
			{user.role === RolesEnum.DRIVER ? <MenuNavigator.Screen name='Home' component={DriverHome} /> : null}
			{user.role === RolesEnum.PASSENGER ? (
				<MenuNavigator.Screen
					name='Travel'
					component={Travel}
					options={{
						tabBarLabel: 'Travel',
						tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name='car' color={color} size={size} />,
					}}
				/>
			) : null}
			<MenuNavigator.Screen
				name='Menu'
				component={Menu}
				{...(user.role === RolesEnum.PASSENGER
					? {
							options: {
								tabBarLabel: 'Menu',
								tabBarIcon: ({ color, size }: any) => <MaterialCommunityIcons name='menu' color={color} size={size} />,
							},
					  }
					: {})}
			/>
		</MenuNavigator.Navigator>
	);
};

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
	text: {
		textAlign: 'center',
	},
});

export default Home;
