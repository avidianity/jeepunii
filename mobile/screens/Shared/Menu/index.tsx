import { createStackNavigator } from '@react-navigation/stack';
import React, { FC, Fragment, useContext } from 'react';
import DrawerMenu from '../../../components/DrawerMenu';
import { AuthContext } from '../../../contexts';
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
		<Fragment>
			<DrawerMenu />
			<MenuStack.Navigator initialRouteName='Main' headerMode='none'>
				<MenuStack.Screen name='Main' component={Main} />
				<MenuStack.Screen name='Transactions' component={Transactions} />
			</MenuStack.Navigator>
		</Fragment>
	);
};

export default Menu;
