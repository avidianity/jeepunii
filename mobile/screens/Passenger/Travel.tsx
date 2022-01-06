import React, { FC, useState } from 'react';
import { Button, Icon, Text } from 'react-native-elements';
import Container from '../../components/Container';
import { StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { JeepContract } from '../../contracts/jeep.contract';
import { useArray, useNullable } from '../../hooks';
import { PermissionStatus } from 'expo-modules-core';
import { SessionContract } from '../../contracts/session.contract';
import { UserContract } from '../../contracts/user.contract';
import { calculateFromPoints, getLocation, handleErrors } from '../../helpers';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts';
import { SessionPassengerContract } from '../../contracts/session-passenger.contract';
import Done from './Done';
import { SessionPointContract } from '../../contracts/session-point.contract';

type Props = {};

type Modes = 'scan' | 'view';

const Travel: FC<Props> = (props) => {
	const [mode, setMode] = useState<Modes>('view');
	const [locationGranted, setLocationGranted] = useState(false);
	const [scannerGranted, setScannerGranted] = useState(false);
	const [scanned, setScanned] = useState(false);
	const { user, setUser } = useContext(AuthContext);
	const [riding, setRiding] = useState(user?.riding || false);
	const [jeep, setJeep] = useNullable<JeepContract>();
	const [session, setSession] = useNullable<SessionContract>();
	const [driver, setDriver] = useNullable<UserContract>();
	const [done, setDone] = useState(false);
	const [sessionPassenger, setSessionPassenger] = useNullable<SessionPassengerContract>();
	const [points, setPoints] = useArray<SessionPointContract>();

	const askScanner = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setScannerGranted(status === PermissionStatus.GRANTED);
	};

	const askLocation = async () => {
		try {
			const response = await Location.requestForegroundPermissionsAsync();
			if (response.status === Location.PermissionStatus.GRANTED && !locationGranted) {
				setLocationGranted(true);
			} else if (response.status === Location.PermissionStatus.DENIED) {
				setLocationGranted(false);
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const record = async () => {
		await askLocation();
		const location = await getLocation(Location);
		if (!location) {
			return null;
		}
		return { lat: location.coords.latitude, lon: location.coords.longitude };
	};

	const parseQr = async (payload: string) => {
		try {
			const data = await record();
			if (data) {
				if (riding) {
					const {
						data: { sessionPassenger },
					} = await axios.post<{ passenger: UserContract; sessionPassenger: SessionPassengerContract }>('/jeeps/passenger/out', {
						...data,
						payload,
					});
					setSession(null);
					setJeep(null);
					setDriver(null);
					setRiding(false);
					setSessionPassenger(sessionPassenger);
					setDone(true);
				} else {
					const {
						data: { driver, jeep, session },
					} = await axios.post('/jeeps/passenger/in', {
						...data,
						payload,
					});
					setDriver(driver);
					setJeep(jeep);
					setSession(session);
					setRiding(true);
				}
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const check = async () => {
		try {
			if (user?.riding) {
				const {
					data: { driver, jeep, session },
				} = await axios.get('/jeeps/passenger/current');
				setDriver(driver);
				setJeep(jeep);
				setSession(session);
				setRiding(true);
			} else {
				setSession(null);
				setJeep(null);
				setDriver(null);
				setRiding(false);
			}
		} catch (error) {
			if (user) {
				user.riding = false;
				setUser(user);
				setRiding(false);
			}
			console.log(error);
		}
	};

	const watch = async () => {
		try {
			if (session) {
				const { data: points } = await axios.get(`/jeeps/passenger/${user?.id}/${session.id}/points`);
				setPoints(points);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const calculate = () => {
		if (points.length > 0) {
			return calculateFromPoints(points);
		} else {
			return 10;
		}
	};

	useEffect(() => {
		askLocation();
		check();

		const handle = setInterval(watch, 10000);

		return () => {
			clearInterval(handle);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<Container style={{ paddingTop: 80 }}>
			{done && sessionPassenger ? (
				<Done session={sessionPassenger} done={() => setDone(false)} />
			) : (
				<>
					{mode === 'view' ? (
						<>
							<Button
								icon={<Icon name='qr-code' color='#fff' />}
								title='Scan Jeep'
								onPress={async () => {
									await askScanner();
									setMode('scan');
									setScanned(false);
								}}
							/>
						</>
					) : scannerGranted ? (
						<View style={styles.barCodeView}>
							<BarCodeScanner
								onBarCodeScanned={
									scanned
										? undefined
										: (event) => {
												setScanned(true);
												setMode('view');
												parseQr(event.data);
										  }
								}
								style={StyleSheet.absoluteFill}
							/>
						</View>
					) : (
						<View>
							<Text>No Permissions</Text>
							<Button title='Get Permission' onPress={askScanner} />
						</View>
					)}
					{jeep ? (
						<View style={{ marginTop: 12 }}>
							<Text>Jeep Name: {jeep.name}</Text>
							<Text>Cooperative: {jeep.cooperative?.name}</Text>
							<Text>Driver: {driver ? `${driver.firstName} ${driver.lastName}` : 'N/A'}</Text>
							<Text>Plate Number: {jeep.plateNumber}</Text>
							<Text>Estimated Fare: ₱{calculate()}</Text>
						</View>
					) : null}
				</>
			)}
		</Container>
	);
};

const styles = StyleSheet.create({
	barCodeView: {
		width: 240,
		height: 240,
		marginBottom: 40,
		borderColor: '#000',
		borderWidth: 4,
	},
});

export default Travel;
