import { useNavigation } from '@react-navigation/native';
import React, { FC, useContext, useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../constants';
import { AuthContext } from '../contexts';
import { RolesEnum } from '../contracts/user.contract';

type Props = {};

const DrawerMenu: FC<Props> = (props) => {
	const { user } = useContext(AuthContext);
	const navigation: any = useNavigation();

	useEffect(() => {
		if (!user) {
			navigation.navigate('Auth', {
				screen: 'Login',
			});
		}
	}, [user, navigation]);

	if (!user) {
		return null;
	}
	return user.role === RolesEnum.DRIVER ? (
		<View
			style={{
				height: 50,
				width: '100%',
				backgroundColor: Colors.primary,
				marginTop: 40,
				alignItems: 'flex-start',
			}}>
			<Button
				type='clear'
				icon={{
					name: 'menu',
					type: 'material',
					size: 28,
					color: Colors.light,
				}}
				onPress={() => {
					if (navigation.toggleDrawer) {
						navigation.toggleDrawer();
					}
				}}
			/>
		</View>
	) : null;
};

export default DrawerMenu;
