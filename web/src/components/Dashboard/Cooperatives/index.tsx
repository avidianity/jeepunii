import React, { FC } from 'react';
import { Route, Switch } from 'react-router';
import { useURL } from '../../../hooks';
import Form from './Form';
import List from './List';

type Props = {};

const Cooperatives: FC<Props> = (props) => {
	const url = useURL();

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} component={Form} />
			<Route path={url('/:cooperativeID/edit')} component={Form} />
		</Switch>
	);
};

export default Cooperatives;
