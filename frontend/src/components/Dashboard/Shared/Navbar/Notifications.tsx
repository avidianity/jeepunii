import React, { FC, useState } from 'react';
import { outIf } from '../../../../helpers';

type Props = {};

const Notifications: FC<Props> = (props) => {
	const [show, setShow] = useState(false);

	return (
		<li className={`notifications dropdown ${outIf(show, 'show')}`}>
			<span className='counter bgc-red'>3</span>
			<a
				href='/'
				className='dropdown-toggle no-after'
				onClick={(e) => {
					e.preventDefault();
					setShow(!show);
				}}>
				<i className='ti-bell'></i>
			</a>
			<ul className={`dropdown-menu ${outIf(show, 'show')}`}>
				<li className='pX-20 pY-15 bdB'>
					<i className='ti-bell pR-10'></i>
					<span className='fsz-sm fw-600 c-grey-900'>Notifications</span>
				</li>
				<li>
					<ul className='ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm'>
						<li>
							<a href='' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/1.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<span>
										<span className='fw-500'>John Doe</span>
										<span className='c-grey-600'>
											liked your
											<span className='text-dark'>post</span>
										</span>
									</span>
									<p className='m-0'>
										<small className='fsz-xs'>5 mins ago</small>
									</p>
								</div>
							</a>
						</li>
						<li>
							<a href='' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/2.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<span>
										<span className='fw-500'>Moo Doe</span>
										<span className='c-grey-600'>
											liked your
											<span className='text-dark'>cover image</span>
										</span>
									</span>
									<p className='m-0'>
										<small className='fsz-xs'>7 mins ago</small>
									</p>
								</div>
							</a>
						</li>
						<li>
							<a href='' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/3.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<span>
										<span className='fw-500'>Lee Doe</span>
										<span className='c-grey-600'>
											commented on your
											<span className='text-dark'>video</span>
										</span>
									</span>
									<p className='m-0'>
										<small className='fsz-xs'>10 mins ago</small>
									</p>
								</div>
							</a>
						</li>
					</ul>
				</li>
				<li className='pX-20 pY-15 ta-c bdT'>
					<span>
						<a href='' className='c-grey-600 cH-blue fsz-sm td-n'>
							View All Notifications
							<i className='ti-angle-right fsz-xs mL-10'></i>
						</a>
					</span>
				</li>
			</ul>
		</li>
	);
};

export default Notifications;
