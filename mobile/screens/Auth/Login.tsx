import React, { FC, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Input, Image, Button, Text } from 'react-native-elements';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants';
import { Controller, useForm } from 'react-hook-form';
import { handleErrors } from '../../helpers';
import axios from 'axios';
import { State } from '../../libraries/State';
import { AuthContext } from '../../contexts';
import { UserContract } from '../../contracts/user.contract';
import Toast from 'react-native-root-toast';

type Props = {};

type Inputs = { email: string; password: string };

const Login: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const navigation = useNavigation<any>();

	const state = State.getInstance();

	const { setUser } = useContext(AuthContext);

	const { control, handleSubmit } = useForm<Inputs>();

	const submit = async (payload: Inputs) => {
		if (processing) {
			return;
		}
		setProcessing(true);
		try {
			const {
				data: { user, token },
			} = await axios.post<{ user: UserContract; token: string }>('/auth/login', payload);

			if (!['Passenger', 'Driver'].includes(user.role)) {
				return Toast.show('This account is not allowed in this application.', {
					duration: Toast.durations.LONG,
					position: Toast.positions.BOTTOM,
				});
			}

			await Promise.all([state.set('user', user), state.set('token', token)]);
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
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={require('../../assets/manifest-icon-512.png')} style={{ width: 200, height: 200 }} />
			</View>
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input label='Email' autoCompleteType='email' onBlur={onBlur} onChangeText={(value) => onChange(value)} value={value} />
				)}
				name='email'
				defaultValue=''
			/>
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						secureTextEntry={true}
						label='Password'
						onBlur={onBlur}
						onChangeText={(value) => onChange(value)}
						value={value}
					/>
				)}
				name='password'
				defaultValue=''
			/>
			<Button
				title={!processing ? 'Login' : <ActivityIndicator size='small' color={Colors.light} />}
				buttonStyle={styles.button}
				onPress={handleSubmit(submit)}
			/>
			<Text onPress={() => navigation.push('Register')} style={styles.link}>
				Don't have an account? Register
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		alignItems: 'center',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingLeft: 40,
		paddingRight: 40,
		paddingTop: 100,
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

export default Login;
