import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import FourZeroFour from './components/Shared/FourZeroFour';
import { AuthContext, EventContext } from './contexts';
import { EventBus } from './libraries/EventBus';
import { routes } from './routes';

function App() {
	const [logged, setLogged] = useState(false);

	const EventBuses = {
		AuthBus: new EventBus(),
	};

	const fetchRequirements = () => {
		['/loader.js', '/bundle.js'].forEach((url) => {
			const script = document.createElement('script');
			script.src = `${process.env.PUBLIC_URL}${url}`;
			script.defer = true;
			script.type = 'text/javascript';
			document.body.append(script);
		});
	};

	useEffect(() => {
		fetchRequirements();
		const logoutKey = EventBuses.AuthBus.listen('logout', () => setLogged(false));
		const loginKey = EventBuses.AuthBus.listen('login', () => setLogged(true));
		return () => {
			EventBuses.AuthBus.unlisten(loginKey);
			EventBuses.AuthBus.unlisten(logoutKey);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<AuthContext.Provider value={{ logged, setLogged }}>
			<EventContext.Provider value={EventBuses}>
				<Router>
					<Switch>
						<Route path={routes.LANDING} exact component={Landing} />
						<Route path={routes.LOGIN} component={Login} />
						<Route path={routes.REGISTER} component={Register} />
						<Route path={routes.DASHBOARD} component={Dashboard} />
						<Route component={FourZeroFour} />
					</Switch>
				</Router>
			</EventContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
