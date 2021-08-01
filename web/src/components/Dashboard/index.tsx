import React, { FC, useContext, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { v4 } from 'uuid';
import { AuthContext } from '../../contexts';
import { RolesEnum } from '../../contracts/user.contract';
import { useURL } from '../../hooks';
import { routes } from '../../routes';
import Cooperatives from './Cooperatives';
import Jeeps from './Jeeps';
import Logs from './Logs';
import Footer from './Shared/Footer';
import Navbar from './Shared/Navbar';
import Settings from './Shared/Settings';
import Sidebar from './Shared/Sidebar';
import Users from './Users';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const url = useURL();

	const { user, logged } = useContext(AuthContext);

	const history = useHistory();

	const fetchRequirements = (id: string) => {
		const scripts = ['/loader.js', '/bundle.js'].map((url) => {
			const script = document.createElement('script');
			script.src = `${process.env.PUBLIC_URL}${url}`;
			script.defer = true;
			script.type = 'text/javascript';
			script.setAttribute('data-id', id);
			return script;
		});
		document.body.append(...scripts);
	};

	useEffect(() => {
		if (!user || !logged) {
			history.goBack();
		}
	}, [user, logged, history]);

	useEffect(() => {
		const id = v4();
		fetchRequirements(id);

		return () => {
			document.querySelectorAll(`[data-id="${id}"]`)?.forEach((element) => element.remove());
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Sidebar />
			<div className='page-container'>
				<Navbar />
				<main className='main-content bgc-grey-100'>
					<div id='mainContent'>
						<div className='full-container pt-5'>
							<Switch>
								<Route path={url(routes.COOPERATIVES)} component={Cooperatives} />
								<Route path={url(routes.JEEPS)} component={Jeeps} />
								<Route path={url(routes.LOGS)} component={Logs} />
								<Route path={url(routes.ADMINS)} render={(props) => <Users type={RolesEnum.ADMIN} {...props} />} />
								<Route path={url(routes.OWNERS)} render={(props) => <Users type={RolesEnum.COOPERATIVE} {...props} />} />
								<Route path={url(routes.DRIVERS)} render={(props) => <Users type={RolesEnum.DRIVER} {...props} />} />
								<Route path={url(routes.PASSENGERS)} render={(props) => <Users type={RolesEnum.PASSENGER} {...props} />} />
								<Route path={url(routes.SETTINGS)} component={Settings} />
							</Switch>
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;
