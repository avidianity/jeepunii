import { createStackNavigator } from '@react-navigation/stack';
import React, { FC, useContext } from 'react';
import { AuthContext } from '../../../contexts';
import { RolesEnum } from '../../../contracts/user.contract';
import Main from './Main';
import Transactions from './Transactions';

type Props = {};

const MenuStack = createStackNavigator();

const Menu: FC<Props> = (props) => {
	const { user } = useContext(AuthContext);

	if (!user) {
		return null;
	}

	return (
		<MenuStack.Navigator initialRouteName='Main' headerMode='none'>
			<MenuStack.Screen name='Main' component={Main} />
			{user.role === RolesEnum.PASSENGER ? <MenuStack.Screen name='Transactions' component={Transactions} /> : null}
		</MenuStack.Navigator>
	);
};

export default Menu;
