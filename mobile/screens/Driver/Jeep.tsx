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
import { getLocation, handleErrors } from '../../helpers';
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

const id = String.random(10);

const Jeep: FC<Props> = (props) => {
	const { jeep } = useContext(JeepContext);
	const { socket } = useContext(SocketContext);
	const [session, setSession] = useNullable<SessionContract>();
	const [handle, setHandle] = useNullable<NodeJS.Timeout>();
	const [refreshHandle, setRefreshHandle] = useNullable<NodeJS.Timeout>();
	const [passengerHandle, setPassengerHandle] = useNullable<NodeJS.Timeout>();
	const [granted, setGranted] = useState(false);
	const [passengers, setPassengers] = useArray<Passenger>();

	if (!socket) {
		return null;
	}

	const listenToSockets = (session: SessionContract) => {
		socket.on(`session.${session.id}.passenger.in`, (passenger: UserContract) => {
			const exists = passengers.find((item) => Number(item.data.id) === Number(passenger.id));

			if (!exists) {
				passengers.push({
					data: passenger,
					online: true,
				});
			}

			socket.on(`disconnect.${passenger.id}`, () => {
				const index = passengers.findIndex((item) => Number(item.data.id) === Number(passenger.id));
				const item = passengers[index];

				if (!item || !item.online) {
					return;
				}

				item.online = false;
				passengers.splice(index, 1, item);

				setPassengers([...passengers]);
			});

			socket.on(`connect.${passenger.id}`, () => {
				const index = passengers.findIndex((item) => Number(item.data.id) === Number(passenger.id));
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

		socket.on(`session.${session.id}.passenger.out`, (passenger) => {
			const index = passengers.findIndex((item) => Number(item.data.id) === Number(passenger.id));
			const item = passengers[index];

			if (!item) {
				return;
			}

			passengers.splice(index, 1);

			socket.off(`connect.${item.data.id}`);
			socket.off(`disconnect.${item.data.id}`);

			setPassengers([...passengers]);
		});
	};

	const current = async () => {
		try {
			const { data: session } = await axios.get<SessionContract>('/drivers/session');

			listenToSockets(session);

			if (session.passengers) {
				const currentPassengers = session.passengers
					.filter((passenger) => passenger.passenger)
					.map((passenger) => ({
						data: passenger.passenger!,
						online: passenger.passenger?.anonymous ? true : passenger.passenger?.online || false,
					}));
				setPassengers([...passengers, ...currentPassengers]);
			}
			setSession(session);
			start();
		} catch (error: any) {
			setSession(null);
			console.log(error.toObject ? error.toObject() : error);
		}
	};

	const ask = async () => {
		try {
			const response = await Location.requestForegroundPermissionsAsync();
			const responseBackground = await Location.requestBackgroundPermissionsAsync();
			if (response.status === Location.PermissionStatus.GRANTED && responseBackground.status === Location.PermissionStatus.GRANTED) {
				if (!granted) {
					setGranted(true);
				}
			} else {
				if (granted) {
					setGranted(false);
				}
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const record = async () => {
		try {
			const location = await getLocation(Location);
			if (location) {
				await axios.post('/drivers/session/point', {
					lat: location.coords.latitude,
					lon: location.coords.longitude,
				});
			}
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
		setPassengerHandle(setInterval(() => fetchPassengers(), 10000));
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
		socket.off(`session.${session.id}.passenger.in`);
		socket.off(`session.${session.id}.passenger.out`);
		passengers.forEach((passenger) => socket.off(`connect.${passenger.data.id}`));
		passengers.forEach((passenger) => socket.off(`disconnect.${passenger.data.id}`));
	};

	useEffect(() => {
		ask();
		current();
		Location.startLocationUpdatesAsync(id, { activityType: Location.ActivityType.AutomotiveNavigation });

		return () => {
			clearHandles();
			Location.stopLocationUpdatesAsync(id);
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
										listenToSockets(session);
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
