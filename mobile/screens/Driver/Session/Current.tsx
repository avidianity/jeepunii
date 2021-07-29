import React, { FC } from 'react';
import { Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Container from '../../../components/Container';
import { SessionContract } from '../../../contracts/session.contract';

type Props = {
	session: SessionContract;
	stop: () => void;
};

const Current: FC<Props> = ({ session, stop }) => {
	return (
		<Container>
			<Button
				title='Stop Driving'
				icon={<Icon name='logout' type='material' color='#fff' />}
				onPress={() => {
					Alert.alert('Stop Driving', 'Are you sure you want to stop driving?', [
						{
							text: 'Confirm',
							style: 'default',
							onPress: stop,
						},
						{
							text: 'Cancel',
							style: 'cancel',
						},
					]);
				}}
			/>
		</Container>
	);
};

export default Current;
