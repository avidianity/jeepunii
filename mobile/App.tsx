import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import './boot';
import { useNullable } from './hooks';
import { UserContract } from './contracts/user.contract';
import Splash from './screens/Splash';
import { AuthContext, NetContext, SocketContext, ThemeContext } from './contexts';
import Auth from './screens/Auth';
import Home from './screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, SERVER_URL } from './constants';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from 'react-query';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useEffect } from 'react';
import { State } from './libraries/State';
import { PermissionsAndroid } from 'react-native';

const RootStack = createStackNavigator();

export default function App() {
	const [user, setUser] = useNullable<UserContract>();
	const [token, setToken] = useState('');
	const [dark, setDark] = useState(false);
	const [socket, setSocket] = useNullable<Socket>();
	const state = State.getInstance();
	const [_, setGranted] = useState(false);
	const [online, setOnline] = useState(true);

	const ping = async () => {
		try {
			const { data } = await axios.get<string>('/auth/ping');
			setOnline(data === 'pong');
		} catch (_) {
			setOnline(false);
		}
	};

	const setup = async () => {
		if (await state.has('token')) {
			init((await state.get<string>('token'))!);
		}
	};

	const init = (token: string) => {
		const socket = io(SERVER_URL, {
			extraHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});

		socket.on('connect', () => {
			setSocket(socket);
		});
	};

	const permissions = async () => {
		try {
			const granted = await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
			]);

			setGranted(
				granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
					granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
					granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		ping();
		permissions();
		const key = state.listen<string>('token', (token) => {
			if (!socket) {
				init(token);
			}
		});
		state
			.get('token')
			.then((token) =>
				axios.get<UserContract>('/auth/check', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
			)
			.then(async ({ data: user }) => {
				await state.set('user', user);
				setUser(user);
			})
			.catch(async () => {
				await state.remove('user');
				await state.remove('token');
				setUser(null);
			});
		setup();
		return () => {
			state.unlisten(key);
		};
		// eslint-disable-next-line
	}, []);

	return (
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
			<QueryClientProvider client={new QueryClient()}>
				<SafeAreaProvider>
					<RootSiblingParent>
						<NetContext.Provider value={{ online }}>
							<SocketContext.Provider value={{ socket, setSocket }}>
								<ThemeContext.Provider value={{ dark, setDark }}>
									<NavigationContainer>
										<AuthContext.Provider value={{ user, setUser, token, setToken }}>
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
								</ThemeContext.Provider>
							</SocketContext.Provider>
						</NetContext.Provider>
					</RootSiblingParent>
				</SafeAreaProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
