import React, { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';

type Props = {};

const Sales: FC<Props> = (props) => {
	return (
		<View style={{ paddingTop: 20 }}>
			<Text>Hello Sales</Text>
		</View>
	);
};

export default Sales;
