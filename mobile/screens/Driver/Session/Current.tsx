import axios from 'axios';
import React, { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, Dimensions, StyleSheet, View } from 'react-native';
import { Alert } from 'react-native';
import { Icon, Button, Text, Input } from 'react-native-elements';
import Container from '../../../components/Container';
import { Colors } from '../../../constants';
import { SessionContract } from '../../../contracts/session.contract';
import { RolesEnum, UserContract } from '../../../contracts/user.contract';
import { getLocation, getPercentage, handleErrors } from '../../../helpers';
import { Passenger as PassengerContract } from '../Jeep';
import Passenger from './Passenger';
import * as Location from 'expo-location';
import { SessionPassengerContract } from '../../../contracts/session-passenger.contract';

type Props = {
	session: SessionContract;
	stop: () => void;
	passengers: PassengerContract[];
};

type Inputs = Pick<UserContract, 'firstName' | 'lastName' | 'address' | 'email' | 'phone' | 'password' | 'role'>;

const Current: FC<Props> = ({ stop, passengers, session }) => {
	const [open, setOpen] = useState(false);
	const [processing, setProcessing] = useState(false);

	const { control, handleSubmit, reset } = useForm<Inputs>();

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			data.email = `${String.random(10)}@yopmail.com`;
			data.address = String.random(10);
			data.password = String.random(10);
			data.lastName = 'N/A';
			data.phone = '+639163758735';
			data.role = RolesEnum.PASSENGER;

			const { data: passenger } = await axios.post<UserContract>('/auth/register/anonymous', {
				...data,
				context: 'mobile',
			});

			const location = await getLocation(Location);

			if (!location) {
				throw new Error('No location.');
			}

			await axios.post('/jeeps/passenger/anonymous/in', {
				lat: location.coords.latitude,
				lon: location.coords.longitude,
				passengerId: passenger.id,
			});

			reset();
			setOpen(false);
		} catch (error) {
			handleErrors(error);
		} finally {
			setProcessing(false);
		}
	};

	const unassignPassenger = async (id: number) => {
		try {
			const location = await getLocation(Location);

			if (!location) {
				throw new Error('No location.');
			}

			/**
			 * TODO
			 * 1. Display modal and use returned data to display fee and info of passenger.
			 */
			const {
				data: {},
			} = await axios.post<{ sessionPassenger: SessionPassengerContract; passenger: UserContract }>(
				'/jeeps/passenger/anonymous/out',
				{
					lat: location.coords.latitude,
					lon: location.coords.longitude,
					passengerId: id,
				}
			);
		} catch (error) {
			handleErrors(error);
		}
	};

	return (
		<Container style={{ width: '100%', height: '100%' }}>
			<View style={{ flexDirection: 'row', marginBottom: 4 }}>
				<View style={{ paddingHorizontal: 4 }}>
					<Button
						title='Stop Driving'
						icon={<Icon name='logout' type='material' color='#fff' />}
						onPress={() => {
							if (passengers.length === 0) {
								Alert.alert('Stop Driving', 'Are you sure you want to stop driving?', [
									{
										text: 'Confirm',
										style: 'default',
										onPress: stop,
									},
									{
										text: 'Cancel',
										style: 'cancel',
									},
								]);
							}
						}}
						disabled={passengers.length > 0}
					/>
				</View>
				<View style={{ paddingHorizontal: 4 }}>
					<Button
						title='Add Passenger'
						onPress={() => {
							setOpen(!open);
						}}
						style={{ marginTop: 10 }}
						disabled={open}
					/>
				</View>
			</View>
			<View style={styles.list}>
				{passengers.map((passenger, index) => (
					<Passenger
						session={session}
						passenger={passenger}
						key={index}
						style={styles.item}
						onEnd={(id) => unassignPassenger(id)}
					/>
				))}
			</View>
			<View style={{ width: '100%', height: '100%', marginTop: 20 }}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={open}
					onRequestClose={() => {
						reset();
						setOpen(!open);
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalTitle}>Add Passenger</Text>
							<View style={{ margin: 6, width: '100%' }}>
								<Controller
									control={control}
									render={({ field: { onChange, onBlur, value } }) => (
										<Input
											label='First Name'
											autoCompleteType='name'
											onBlur={onBlur}
											onChangeText={(value) => onChange(value)}
											value={value}
											style={styles.input}
										/>
									)}
									name='firstName'
									defaultValue=''
								/>
							</View>
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ paddingHorizontal: 6 }}>
									<Button
										title={!processing ? 'Submit' : <ActivityIndicator size='small' color={Colors.light} />}
										onPress={handleSubmit(submit)}
										disabled={processing}
									/>
								</View>
								<View style={{ paddingHorizontal: 6 }}>
									<Button
										title='Cancel'
										onPress={() => {
											setOpen(false);
										}}
										disabled={processing}
									/>
								</View>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		marginTop: 10,
		width: '100%',
	},
	item: {
		height: 70,
		width: '50%',
		paddingHorizontal: 2,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		height: Dimensions.get('window').height - getPercentage(Dimensions.get('window').height, 15),
		width: Dimensions.get('window').width - getPercentage(Dimensions.get('window').width, 5),
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 20,
	},
	modalText: {},
	input: {
		width: '100%',
	},
});

export default Current;
