import React, { FC } from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../params/RootStack.params';
import Login from './Login';
import Register from './Register';

type Props = {};

type ScreenProps = StackNavigationProp<RootStackParams, 'Auth'>;

const AuthStack = createStackNavigator();

const Auth: FC<Props> = (props) => {
	return (
		<AuthStack.Navigator headerMode='none'>
			<AuthStack.Screen name='Login' component={Login} options={{ animationEnabled: true }} />
			<AuthStack.Screen name='Register' component={Register} options={{ animationEnabled: true }} />
		</AuthStack.Navigator>
	);
};

export default Auth;
