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

type Props = {};

type Modes = 'scan' | 'view';

const Travel: FC<Props> = (props) => {
	const [mode, setMode] = useState<Modes>('view');
	const [granted, setGranted] = useState(false);
	const [scanned, setScanned] = useState(false);
	const [jeep, setJeep] = useNullable<JeepContract>();

	const ask = async () => {
		const { status } = await BarCodeScanner.requestPermissionsAsync();
		setGranted(status === 'granted');
	};

	const parseQr = async (payload: string) => {
		try {
			const { data } = await axios.post<JeepContract>('/jeeps/crypto', {
				payload,
			});
			setJeep(data);
		} catch (error) {
			console.log(error.toJSON(), payload);
			Toast.show('Invalid QR Code.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
		}
	};

	if (!granted && mode === 'scan') {
		return (
			<View>
				<Text>No Permissions</Text>
				<Button title='Get Permission' onPress={ask} />
			</View>
		);
	}

	return (
		<Container style={{ paddingTop: 80 }}>
			{mode === 'view' ? (
				<>
					<Button
						icon={<Icon name='qr-code' color='#fff' />}
						title='Scan Jeep'
						onPress={async () => {
							await ask();
							setMode('scan');
							setScanned(false);
						}}
					/>
				</>
			) : (
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
			)}
			{jeep && (
				<View>
					<Text>Jeep Name: {jeep.name}</Text>
					<Text>Cooperative: {jeep.cooperative?.name}</Text>
					<Text>
						Driver: {jeep.driver?.firstName} {jeep.driver?.lastName}
					</Text>
					<Text>Plate Number: {jeep.plateNumber}</Text>
				</View>
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
