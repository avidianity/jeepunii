import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../../routes';

type Props = {};

const Footer: FC<Props> = (props) => {
	return (
		<footer className='bdT ta-c p-30 lh-0 fsz-sm c-grey-600'>
			<span>
				Copyright © 2019{' '}
				<Link to={routes.LANDING} title='Paymento'>
					Paymento
				</Link>
				. All rights reserved.
			</span>
		</footer>
	);
};

export default Footer;
