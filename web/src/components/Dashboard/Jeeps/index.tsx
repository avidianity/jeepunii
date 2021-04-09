import React, { FC } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useURL } from '../../../hooks';
import Form from './Form';
import List from './List';

type Props = {};

const Jeeps: FC<Props> = (props) => {
	const url = useURL();

	return (
		<Switch>
			<Route path={url('')} exact component={List} />
			<Route path={url('/add')} component={Form} />
			<Route path={url('/:jeepID/edit')} component={Form} />
		</Switch>
	);
};

export default Jeeps;
