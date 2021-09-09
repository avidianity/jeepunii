import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Container from '../../components/Container';
import { JeepContext, SocketContext } from '../../contexts';
import { SessionContract } from '../../contracts/session.contract';
import { handleErrors } from '../../helpers';
import { useArray, useNullable } from '../../hooks';
import Current from './Session/Current';
import StartButton from './Session/StartButton';
import * as Location from 'expo-location';
import Ungranted from './Ungranted';
import { UserContract } from '../../contracts/user.contract';

type Props = {};

export type Passenger = {
	data: UserContract;
	online: boolean;
};

/**
 * TODOS
 *
 * 1. Get Location permissions
 * 2. Create component for non-granted location permission
 * 3. Track lat/long points upon session start
 * 4. Cancel session
 * 5. Save points to server
 * 6. Detect passenger in/out
 * 7. Diff online/offline passengers
 * 8. UI for passengers
 */
const Jeep: FC<Props> = (props) => {
	const { jeep } = useContext(JeepContext);
	const { socket } = useContext(SocketContext);
	const [session, setSession] = useNullable<SessionContract>();
	const [handle, setHandle] = useNullable<NodeJS.Timeout>();
	const [refreshHandle, setRefreshHandle] = useNullable<NodeJS.Timeout>();
	const [passengerHandle, setPassengerHandle] = useNullable<NodeJS.Timeout>();
	const [granted, setGranted] = useState(false);
	const [passengers, setPassengers] = useArray<Passenger>();
	const [passengerSocketsListening, setPassengerSocketsListening] = useState(false);

	const current = async () => {
		try {
			const { data: session } = await axios.get<SessionContract | null>('/drivers/session');
			if (typeof session === 'object' && session !== null) {
				if (!passengerSocketsListening) {
					socket?.on(`session.${session.id}.passenger.in`, (passenger) => {
						const exists = passengers.find((item) => item.data.id === passenger.id);

						if (!exists) {
							passengers.push({
								data: passenger,
								online: true,
							});
						}

						socket?.on(`disconnect.${passenger.id}`, () => {
							const index = passengers.findIndex((item) => item.data.id === passenger.id);
							const item = passengers[index];

							if (!item || !item.online) {
								return;
							}

							item.online = false;
							passengers.splice(index, 1, item);

							setPassengers([...passengers]);
						});

						socket?.on(`connect.${passenger.id}`, () => {
							const index = passengers.findIndex((item) => item.data.id === passenger.id);
							const item = passengers[index];

							if (!item || item.online) {
								return;
							}

							item.online = true;
							passengers.splice(index, 1, item);

							setPassengers([...passengers]);
						});

						setPassengers([...passengers]);
					});

					socket?.on(`session.${session.id}.passenger.out`, (passenger) => {
						const index = passengers.findIndex((item) => item.data.id === passenger.id);
						const item = passengers[index];

						if (!item) {
							return;
						}

						passengers.splice(index, 1);

						socket?.off(`connect.${item.data.id}`);
						socket?.off(`disconnect.${item.data.id}`);

						setPassengers([...passengers]);
					});
					setPassengerSocketsListening(true);
				}
				setSession(session);
				start();
			} else {
				setSession(null);
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const ask = async () => {
		try {
			const response = await Location.requestForegroundPermissionsAsync();
			if (response.status === Location.PermissionStatus.GRANTED && !granted) {
				setGranted(true);
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const record = async () => {
		try {
			const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
			await axios.post('/drivers/session/point', {
				lat: location.coords.latitude,
				lon: location.coords.longitude,
			});
		} catch (error: any) {
			handleErrors(error);
			if (error?.response?.status === 400) {
				stop();
			}
		}
	};

	const fetchPassengers = async () => {
		try {
			const { data } = await axios.get<{ passenger: UserContract; online: boolean }[]>('/jeeps/passengers');

			setPassengers(
				data.map((item) => ({
					data: item.passenger,
					online: item.online,
				}))
			);
		} catch (error) {
			console.error(error);
		}
	};

	const start = () => {
		setHandle(setInterval(() => record(), 5000));
		setPassengerHandle(setInterval(() => fetchPassengers(), 30000));
	};

	const clearHandles = () => {
		if (handle) {
			clearInterval(handle);
			setHandle(null);
		}

		if (refreshHandle) {
			clearInterval(refreshHandle);
			setRefreshHandle(null);
		}

		if (passengerHandle) {
			clearInterval(passengerHandle);
			setPassengerHandle(null);
		}
	};

	const stop = () => {
		clearHandles();

		if (session) {
			destroySessionSockets(session);
			axios.delete('/drivers/session').catch(handleErrors);
			setSession(null);
		}
	};

	const destroySessionSockets = (session: SessionContract) => {
		socket?.off(`session.${session.id}.passenger.in`);
		socket?.off(`session.${session.id}.passenger.out`);
		passengers.forEach((passenger) => socket?.off(`connect.${passenger.data.id}`));
		passengers.forEach((passenger) => socket?.off(`disconnect.${passenger.data.id}`));
		setPassengerSocketsListening(false);
	};

	useEffect(() => {
		ask();
		current();

		return () => {
			clearHandles();

			if (session) {
				destroySessionSockets(session);
			}
		};
		// eslint-disable-next-line
	}, []);

	return (
		<Container style={{ paddingHorizontal: 10 }}>
			{granted ? (
				<>
					<Text h3>{jeep?.name}</Text>
					<Text style={{ fontSize: 16 }}>Assigned: {dayjs(jeep?.updatedAt).fromNow()}</Text>
					<View style={{ marginTop: 20 }}>
						{session ? (
							<Current passengers={passengers} session={session} stop={stop} />
						) : (
							<StartButton
								start={async () => {
									try {
										const { data: session } = await axios.post<SessionContract>('/drivers/session');
										setSession(session);
										start();
									} catch (error) {
										handleErrors(error);
									}
								}}
							/>
						)}
					</View>
				</>
			) : (
				<Ungranted />
			)}
		</Container>
	);
};

export default Jeep;
