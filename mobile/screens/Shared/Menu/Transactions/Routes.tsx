import axios from 'axios';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { LocationContract } from '../../../../contracts/location.contract';
import { useArray } from '../../../../hooks';

type Props = {};

const Routes: FC<Props> = (props) => {
	const [routes, setRoutes] = useArray<LocationContract>();

	const fetch = async () => {
		try {
			const { data } = await axios.get('/analytics/top-routes');
			setRoutes(data);
		} catch (error) {
			console.log(error);
			Toast.show('Unable to fetch route analytics.', {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
			});
		}
	};

	useEffect(() => {
		fetch();
		const handle = setInterval(() => fetch(), 15000);
		return () => {
			clearInterval(handle);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<View style={{ paddingTop: 20 }}>
			{routes.length === 0 ? (
				<Text h4 style={{ textAlign: 'center' }}>
					No Routes Available
				</Text>
			) : null}
			{routes.map((route, index) => (
				<ListItem key={index} bottomDivider>
					<ListItem.Content>
						<ListItem.Title>{route.name}</ListItem.Title>
						<ListItem.Subtitle>
							{route.address_city_district} - {route.address_road}
						</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			))}
		</View>
	);
};

export default Routes;
