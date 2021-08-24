import React, { FC } from 'react';
import { Route, Switch } from 'react-router';
import { useURL } from '../../../hooks';
import List from './List';
import View from './View';

interface Props {}

const Routes: FC<Props> = () => {
	const url = useURL();

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/:id')} component={View} />
		</Switch>
	);
};

export default Routes;
