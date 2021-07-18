import React, { FC } from 'react';
import { Text } from 'react-native-elements';
import Container from '../../components/Container';

type Props = {};

const Home: FC<Props> = (props) => {
	return (
		<Container style={{ paddingTop: 80 }}>
			<Text>Sugoi nano da zooooo</Text>
		</Container>
	);
};

export default Home;
