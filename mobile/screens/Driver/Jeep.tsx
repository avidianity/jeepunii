import axios from 'axios';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import Container from '../../components/Container';
import { JeepContext } from '../../contexts';
import { SessionContract } from '../../contracts/session.contract';
import { handleErrors } from '../../helpers';
import { useNullable } from '../../hooks';
import StartButton from './Session/StartButton';

type Props = {};

/**
 * TODO:
 *
 * 1. Get Location permissions
 * 2. Track lat/long points upon session start
 * 3. Cancel session
 * 4. Save points to server
 */
const Jeep: FC<Props> = (props) => {
	const { jeep } = useContext(JeepContext);
	const [session, setSession] = useNullable<SessionContract>();

	const start = async () => {
		try {
			const { data: session } = await axios.post<SessionContract>('/drivers/session');
			setSession(session);
		} catch (error) {
			handleErrors(error);
		}
	};

	const current = async () => {
		try {
			const { data: session } = await axios.get<SessionContract | null>('/drivers/session');
			setSession(session);
		} catch (error) {
			handleErrors(error);
		}
	};

	useEffect(() => {
		current();
		// eslint-disable-next-line
	}, []);

	return (
		<Container style={{ paddingHorizontal: 30 }}>
			<Text h3>{jeep?.name}</Text>
			<Text style={{ fontSize: 16 }}>Assigned: {dayjs(jeep?.updatedAt).fromNow()}</Text>
			<View style={{ marginTop: 20 }}>{session ? null : <StartButton start={start} />}</View>
		</Container>
	);
};

export default Jeep;
