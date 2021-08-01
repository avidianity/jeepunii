import React, { FC, useState } from 'react';
import { Button, Icon, Text } from 'react-native-elements';
import Container from '../../components/Container';
import { usePermissions, CAMERA } from 'expo-permissions';
import { StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { JeepContract } from '../../contracts/jeep.contract';
import Toast from 'react-native-root-toast';
import { useNullable } from '../../hooks';
import { PermissionStatus } from 'expo-modules-core';
import { SessionContract } from '../../contracts/session.contract';
import { UserContract } from '../../contracts/user.contract';
import { handleErrors } from '../../helpers';
import * as Location from 'expo-location';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../contexts';

type Props = {};

type Modes = 'scan' | 'view';

const Travel: FC<Props> = (props) => {
	const [mode, setMode] = useState<Modes>('view');
	const [locationGranted, setLocationGranted] = useState(false);
	const [scannerGranted, setScannerGranted] = useState(false);
	const [scanned, setScanned] = useState(false);
	const { user } = useContext(AuthContext);
	const [riding, setRiding] = useState(user?.riding || false);
	const [jeep, setJeep] = useNullable<JeepContract>();
	const [session, setSession] = useNullable<SessionContract>();
	const [driver, setDriver] = useNullable<UserContract>();

	const askScanner = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setScannerGranted(status === PermissionStatus.GRANTED);
	};

	const askLocation = async () => {
		try {
			const response = await Location.requestForegroundPermissionsAsync();
			if (response.status === Location.PermissionStatus.GRANTED && !locationGranted) {
				setLocationGranted(true);
			}
		} catch (error) {
			handleErrors(error);
		}
	};

	const record = async () => {
		await askLocation();
		const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
		return { lat: location.coords.latitude, lon: location.coords.longitude };
	};

	const parseQr = async (payload: string) => {
		try {
			const data = await record();
			if (riding) {
				await axios.post('/jeeps/passenger/out', {
					...data,
					payload,
				});
				setSession(null);
				setJeep(null);
				setDriver(null);
				setRiding(false);
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
		} catch (error) {
			handleErrors(error);
		}
	};

	useEffect(() => {
		askLocation();
		// eslint-disable-next-line
	}, []);

	return (
		<Container style={{ paddingTop: 80 }}>
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
				</View>
			) : null}
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
