import React, { FC } from 'react';

type Props = {
	title?: string;
	style?: React.CSSProperties;
	className?: string;
};

const Card: FC<Props> = ({ title, children, style, className }) => {
	return (
		<div className={`bgc-white bd bdrs-3 p-20 mB-20 ${className}`} style={style}>
			<h4 className='c-grey-900 mB-20'>{title}</h4>
			{children}
		</div>
	);
};

export default Card;
