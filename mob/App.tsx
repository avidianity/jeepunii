import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './boot';
import { useNullable } from './hooks';
import { UserContract } from './contracts/user.contract';
import Splash from './screens/Splash';
import { AuthContext, ThemeContext } from './contexts';
import Auth from './screens/Auth';
import Home from './screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from './constants';
import { RootSiblingParent } from 'react-native-root-siblings';

const RootStack = createStackNavigator();

export default function App() {
	const [user, setUser] = useNullable<UserContract>();
	const [dark, setDark] = useState(false);

	return (
		<SafeAreaProvider>
			<RootSiblingParent>
				<ThemeContext.Provider value={{ dark, setDark }}>
					<ThemeProvider
						value={{
							dark,
							colors: {
								primary: Colors.primary,
								background: Colors.light,
								card: Colors.info,
								text: Colors.dark,
								border: Colors.danger,
								notification: Colors.success,
							},
						}}>
						<NavigationContainer>
							<AuthContext.Provider value={{ user, setUser }}>
								<RootStack.Navigator headerMode='none' initialRouteName={!user ? 'Splash' : 'Home'}>
									<RootStack.Screen
										name='Splash'
										component={Splash}
										options={{
											animationEnabled: true,
										}}
									/>
									<RootStack.Screen name='Auth' component={Auth} options={{ animationEnabled: true }} />
									<RootStack.Screen name='Home' component={Home} options={{ animationEnabled: true }} />
								</RootStack.Navigator>
								<StatusBar style='auto' />
							</AuthContext.Provider>
						</NavigationContainer>
					</ThemeProvider>
				</ThemeContext.Provider>
			</RootSiblingParent>
		</SafeAreaProvider>
	);
}
