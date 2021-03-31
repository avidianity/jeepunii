import React, { FC } from 'react';
import { Loop } from '@material-ui/icons';

type Props = {
	className?: string;
};

const Loading: FC<Props> = ({ className }) => {
	return (
		<div className={`d-flex h-100 align-items-center justify-content-center ${className}`}>
			<Loop className='spin-reverse' />
		</div>
	);
};

export default Loading;
