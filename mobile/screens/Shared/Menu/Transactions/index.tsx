import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { Colors } from '../../../../constants';
import Jeeps from './Jeeps';
import Routes from './Routes';
import Sales from './Sales';

type Props = {};

const Transactions: FC<Props> = (props) => {
	const [index, setIndex] = useState(0);

	return (
		<View style={{ paddingTop: 40, backgroundColor: Colors.light, height: '100%' }}>
			<Tab value={index} onChange={setIndex}>
				<Tab.Item title='Routes' />
				<Tab.Item title='Jeeps' />
				<Tab.Item title='Sales' />
			</Tab>
			<TabView value={index} onChange={setIndex}>
				<TabView.Item style={styles.item}>
					<Routes />
				</TabView.Item>
				<TabView.Item style={styles.item}>
					<Jeeps />
				</TabView.Item>
				<TabView.Item style={styles.item}>
					<Sales />
				</TabView.Item>
			</TabView>
		</View>
	);
};

const styles = StyleSheet.create({
	back: {
		paddingBottom: 20,
	},
	item: {
		width: '100%',
	},
});

export default Transactions;
