import React, { FC, useContext, useState } from 'react';
import { Input, Image, Button, Text } from 'react-native-elements';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { RolesEnum, UserContract } from '../../contracts/user.contract';
import { Colors } from '../../constants';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { handleErrors } from '../../helpers';
import { State } from '../../libraries/State';
import { AuthContext } from '../../contexts';

type Props = {};

type Inputs = {
	firstName: string;
	lastName: string;
	address: string;
	email: string;
	phone: string;
	password: string;
	role: RolesEnum;
};

const Register: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const navigation = useNavigation<any>();

	const state = State.getInstance();

	const { setUser, setToken } = useContext(AuthContext);

	const { control, handleSubmit } = useForm<Inputs>();

	const submit = async (payload: Inputs) => {
		if (processing) {
			return;
		}
		setProcessing(true);

		payload.role = RolesEnum.PASSENGER;
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: UserContract; token: string }>('/auth/register', { ...payload, context: 'mobile' });
			Toast.show('Registered successfully!', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
			await Promise.all([state.set('user', user), state.set('token', token)]);
			setToken(token);
			setUser(user);
			navigation.navigate('Home', {
				screen: 'Menu',
			});
		} catch (error) {
			handleErrors(error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				<View style={{ paddingBottom: 40 }}>
					<View style={styles.imageContainer}>
						<Image source={require('../../assets/manifest-icon-512.png')} style={{ width: 200, height: 200 }} />
					</View>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='First Name'
								autoCompleteType='name'
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='firstName'
						defaultValue=''
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='Last Name'
								autoCompleteType='name'
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='lastName'
						defaultValue=''
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='Address'
								autoCompleteType='street-address'
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='address'
						defaultValue=''
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='Phone'
								autoCompleteType='tel'
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='phone'
						defaultValue=''
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='Email'
								autoCompleteType='email'
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='email'
						defaultValue=''
					/>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<Input
								label='Password'
								secureTextEntry={true}
								onBlur={onBlur}
								onChangeText={(value) => onChange(value)}
								value={value}
							/>
						)}
						name='password'
						defaultValue=''
					/>
					<Button
						title={!processing ? 'Register' : <ActivityIndicator size='small' color={Colors.light} />}
						buttonStyle={styles.button}
						onPress={handleSubmit(submit)}
					/>
					<Text onPress={() => navigation.push('Login')} style={styles.link}>
						Already have an account? Login
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingHorizontal: 40,
	},
	input: {
		height: 10,
	},
	button: {
		marginTop: 12,
		width: '95%',
		fontSize: 12,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	link: {
		marginTop: 20,
		fontWeight: '600',
		color: Colors.primary,
		marginLeft: 12,
	},
});

export default Register;
