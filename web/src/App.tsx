import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import FourZeroFour from './components/Shared/FourZeroFour';
import { AuthContext, EventContext, SocketContext } from './contexts';
import { EventBus } from './libraries/EventBus';
import { State } from './libraries/State';
import { routes } from './routes';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContract } from './contracts/user.contract';
import axios from 'axios';
import Tooltip from './components/Shared/Tooltip';
import { useNullable } from './hooks';
import { io, Socket } from 'socket.io-client';
import { SERVER_URL } from './constants';

function App() {
	const state = State.getInstance();
	const [logged, setLogged] = useState(state.has('user') && state.has('token'));
	const [user, setUser] = useState<UserContract | null>(state.has('user') ? state.get('user') : null);
	const [socket, setSocket] = useNullable<Socket>();

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

	const checkAuth = async () => {
		try {
			const { data } = await axios.get('/auth/check');
			setUser(data);
			setLogged(true);
			if (state.get<boolean>('remember')) {
				state.set('user', data);
			}
		} catch (error) {
			console.log((error as any).toJSON());
			EventBuses.AuthBus.dispatch('logout');
		}
	};

	const initSocket = (token: string) => {
		const socket = io(SERVER_URL, {
			extraHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});

		socket.on('connect', () => {
			setSocket(socket);
		});
	};

	useEffect(() => {
		fetchRequirements();

		if (state.has('token')) {
			const token = state.get<string>('token');
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			initSocket(token);
		}

		const key = state.listen<string>('token', (token) => {
			if (!socket) {
				initSocket(token);
			}
		});

		checkAuth();

		return () => {
			state.unlisten(key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<AuthContext.Provider value={{ logged, setLogged, user, setUser }}>
			<SocketContext.Provider value={{ socket, setSocket }}>
				<EventContext.Provider value={EventBuses}>
					<QueryClientProvider client={new QueryClient()}>
						<Router>
							<Switch>
								<Route path={routes.LANDING} exact component={Landing} />
								<Route path={routes.LOGIN} component={Login} />
								<Route path={routes.REGISTER} component={Register} />
								<Route path={routes.DASHBOARD} component={Dashboard} />
								<Route component={FourZeroFour} />
							</Switch>
							{process.env.NODE_ENV !== 'production' ? <ReactQueryDevtools position='bottom-right' /> : null}
							<Tooltip />
						</Router>
					</QueryClientProvider>
				</EventContext.Provider>
			</SocketContext.Provider>
		</AuthContext.Provider>
	);
}

export default App;
