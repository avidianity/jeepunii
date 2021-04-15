import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../constants';

type Props = {
	style?: StyleProp<ViewStyle>;
};

const Container: FC<Props> = ({ style, children }) => {
	return <View style={StyleSheet.flatten([{ flex: 1, alignItems: 'center', backgroundColor: Colors.light }, style])}>{children}</View>;
};

export default Container;
