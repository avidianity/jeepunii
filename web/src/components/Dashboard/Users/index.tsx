import React, { FC } from 'react';
import { Route, Switch } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { RolesEnum } from '../../../contracts/user.contract';
import { useURL } from '../../../hooks';
import Form from './Form';
import List from './List';

interface Props extends RouteComponentProps {
	type: RolesEnum;
}

const Users: FC<Props> = ({ type }) => {
	const url = useURL();

	return (
		<Switch>
			<Route path={url('')} exact render={(props) => <List type={type} {...props} />} />
			<Route path={url('/add')} render={(props) => <Form type={type} {...props} />} />
			<Route path={url('/:userID/edit')} render={(props) => <Form type={type} {...props} />} />
		</Switch>
	);
};

export default Users;
