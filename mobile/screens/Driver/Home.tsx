import axios from 'axios';
import React, { FC, useContext } from 'react';
import { useEffect } from 'react';
import { Text } from 'react-native-elements';
import Container from '../../components/Container';
import DrawerMenu from '../../components/DrawerMenu';
import { AuthContext, JeepContext, SocketContext } from '../../contexts';
import { JeepContract } from '../../contracts/jeep.contract';
import { handleErrors } from '../../helpers';
import { useNullable } from '../../hooks';
import { State } from '../../libraries/State';
import Jeep from './Jeep';
import NoJeep from './NoJeep';

type Props = {};

const state = State.getInstance();

const Home: FC<Props> = (props) => {
	const { user, setUser } = useContext(AuthContext);
	const { socket } = useContext(SocketContext);
	const [jeep, setJeep] = useNullable<JeepContract>(user?.jeep);

	const fetchJeep = async () => {
		try {
			const { data } = await axios.get<JeepContract>('/jeeps/current');
			if (user) {
				user.jeep = data;
				setUser(user);
				state.set('user', user);
			}
			setJeep(data);
		} catch (error) {
			handleErrors(error);
		}
	};

	useEffect(() => {
		socket?.on(`user.${user?.id}.assign`, ({ jeep }) => {
			const user = { ...jeep.driver };
			delete jeep.driver;
			user.jeep = jeep;
			user.cooperative = jeep.cooperative;
			setUser(user);
			setJeep(jeep);
			state.set('user', user);
		});
		socket?.on(`user.${user?.id}.unassign`, () => setJeep(null));

		return () => {
			socket?.off(`user.${user?.id}.assign`);
			socket?.off(`user.${user?.id}.unassign`);
		};
	}, [socket, user, setJeep]);

	useEffect(() => {
		fetchJeep();
		// eslint-disable-next-line
	}, []);

	if (!socket) {
		return null;
	}

	return (
		<JeepContext.Provider value={{ jeep, setJeep }}>
			<DrawerMenu />
			<Container style={{ paddingTop: 80 }}>{!jeep ? <NoJeep /> : <Jeep />}</Container>
		</JeepContext.Provider>
	);
};

export default Home;
