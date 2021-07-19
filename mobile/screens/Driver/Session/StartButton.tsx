import React, { FC } from 'react';
import { Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';

type Props = {
	start: () => void;
};

const StartButton: FC<Props> = ({ start }) => {
	return (
		<Button
			icon={<Icon name='drivers-license-o' type='font-awesome' color='#fff' style={{ marginRight: 4 }} />}
			title='Start Driving'
			onPress={() =>
				Alert.alert('Start Driving Session', 'Are you sure?', [
					{
						text: 'Confirm',
						onPress: start,
						style: 'default',
					},
					{
						text: 'Cancel',
						style: 'cancel',
					},
				])
			}
		/>
	);
};

export default StartButton;
