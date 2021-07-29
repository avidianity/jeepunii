import React, { FC } from 'react';
import { Text } from 'react-native-elements';
import Container from '../../components/Container';

type Props = {};

const Ungranted: FC<Props> = (props) => {
	return (
		<Container style={{ paddingTop: 80 }}>
			<Text>You must allow location services in order for the app to work.</Text>
		</Container>
	);
};

export default Ungranted;
