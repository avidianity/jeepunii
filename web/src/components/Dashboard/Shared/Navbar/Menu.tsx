import React, { FC, useContext, useState } from 'react';
import { EventContext } from '../../../../contexts';
import { outIf } from '../../../../helpers';

type Props = {};

const Menu: FC<Props> = (props) => {
	const [show, setShow] = useState(false);

	const { AuthBus } = useContext(EventContext);

	return (
		<li className={`dropdown ${outIf(show, 'show')}`}>
			<a
				href='/'
				className='dropdown-toggle no-after peers fxw-nw ai-c lh-1'
				onClick={(e) => {
					e.preventDefault();
					setShow(!show);
				}}>
				<div className='peer mR-10'>
					<img className='w-2r bdrs-50p' src='https://randomuser.me/api/portraits/men/10.jpg' alt='' />
				</div>
				<div className='peer'>
					<span className='fsz-sm c-grey-900'>John Doe</span>
				</div>
			</a>
			<ul className={`dropdown-menu fsz-sm ${outIf(show, 'show')}`}>
				<li>
					<a href='' className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'>
						<i className='ti-user mR-10'></i> <span>Profile</span>
					</a>
				</li>
				<li>
					<a href='' className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'>
						<i className='ti-settings mR-10'></i> <span>Settings</span>
					</a>
				</li>
				<li role='separator' className='divider'></li>
				<li>
					<a
						href=''
						className='d-b td-n pY-5 bgcH-grey-100 c-grey-700'
						onClick={(e) => {
							e.preventDefault();
							AuthBus.dispatch('logout');
						}}>
						<i className='ti-power-off mR-10'></i> <span>Logout</span>
					</a>
				</li>
			</ul>
		</li>
	);
};

export default Menu;
