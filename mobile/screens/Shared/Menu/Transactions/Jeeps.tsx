import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { Avatar, ListItem, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { JeepContract } from '../../../../contracts/jeep.contract';
import { useArray } from '../../../../hooks';

type Props = {};

const Jeeps: FC<Props> = (props) => {
	const [jeeps, setJeeps] = useArray<JeepContract>();

	const fetch = async () => {
		try {
			const { data } = await axios.get('/analytics/jeeps');
			setJeeps(data);
		} catch (error) {
			console.log(error);
			Toast.show('Unable to fetch jeep analytics.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
		}
	};

	useEffect(() => {
		fetch();
		// eslint-disable-next-line
	}, []);

	return (
		<View style={{ paddingTop: 20 }}>
			{jeeps.length === 0 ? (
				<Text h4 style={{ textAlign: 'center' }}>
					No Jeeps Scanned
				</Text>
			) : null}
			{jeeps.map((jeep, index) => (
				<ListItem key={index} bottomDivider>
					<Avatar source={{ uri: jeep.driver?.picture ? jeep.driver.picture.url : 'https://via.placeholder.com/200' }} />
					<ListItem.Content>
						<ListItem.Title>
							{jeep.driver?.firstName} {jeep.driver?.lastName}
						</ListItem.Title>
						<ListItem.Subtitle>
							{jeep.name} - {jeep.plateNumber}
						</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			))}
		</View>
	);
};

export default Jeeps;
