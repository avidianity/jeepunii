import React, { FC, useState } from 'react';
import { Input, Image, Button, Text } from 'react-native-elements';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { RolesEnum, UserContract } from '../../contracts/user.contract';
import { Colors } from '../../constants';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { handleErrors, toBool } from '../../helpers';
import * as ImagePicker from 'expo-image-picker';
import { useNullable } from '../../hooks';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';

type Props = {};

type Inputs = Pick<UserContract, 'firstName' | 'lastName' | 'address' | 'email' | 'phone' | 'password' | 'role'>;

const Register: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const navigation = useNavigation<any>();
	const [image, setImage] = useNullable<ImageInfo>();

	const { control, handleSubmit, reset } = useForm<Inputs>();

	const pick = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== ImagePicker.PermissionStatus.GRANTED) {
			return Toast.show('Please grant camera permissions.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
				shadow: true,
				animation: true,
				hideOnPress: true,
			});
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
		});

		if (!result.cancelled) {
			setImage(result);
		}
	};

	const submit = async (payload: Inputs) => {
		if (processing || !image) {
			return;
		}
		setProcessing(true);

		payload.role = RolesEnum.PASSENGER;
		try {
			const form = new FormData();

			for (const key in payload) {
				form.append(key, (payload as any)[key]);
			}

			form.append('context', 'mobile');

			const filename = image.uri.split('/').pop()!;

			const match = /\.(\w+)$/.exec(filename);
			const type = match ? `image/${match[1]}` : `image`;

			form.append('files', { uri: image.uri, name: filename, type } as any);

			await axios.post<{ user: UserContract }>('/auth/register/passenger', form);

			setImage(null);

			Toast.show('Registered successfully! Please wait for approval.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});

			reset();
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
								autoCapitalize='none'
								autoCorrect={false}
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
						title={toBool(image) ? 'Uploaded' : 'Upload'}
						style={styles.button}
						type='outline'
						onPress={() => pick()}
						disabled={toBool(image)}
					/>
					<Text style={styles.note}>Note: A selfie holding a valid ID is required to register.</Text>
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
	note: {
		fontSize: 14,
		marginTop: 4,
		marginBottom: 12,
	},
});

export default Register;
