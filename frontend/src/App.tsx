import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import { routes } from './routes';

function App() {
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
		// eslint-disable-next-line
	}, []);

	return (
		<Router>
			<Switch>
				<Route path={routes.LANDING} exact component={Landing} />
				<Route path={routes.LOGIN} component={Login} />
				<Route path={routes.REGISTER} component={Register} />
				<Route path={routes.DASHBOARD} component={Dashboard} />
			</Switch>
		</Router>
	);
}

export default App;
