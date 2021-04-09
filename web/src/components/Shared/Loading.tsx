import React, { FC } from 'react';

type Props = {
	className?: string;
};

const Loading: FC<Props> = ({ className }) => {
	return (
		<div className={`d-flex h-100 align-items-center justify-content-center ${className}`}>
			<i className='material-icons spin-reverse'>loop</i>
		</div>
	);
};

export default Loading;
