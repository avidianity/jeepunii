import React, { FC } from 'react';
import { View } from 'react-native';

type Props = {};

const HorizontalDivider: FC<Props> = (props) => {
	return <View style={{ borderBottomColor: '#000', borderBottomWidth: 1, width: '100%' }}></View>;
};

export default HorizontalDivider;
