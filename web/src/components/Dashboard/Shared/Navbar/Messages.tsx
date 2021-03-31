import React, { FC, useState } from 'react';
import { outIf } from '../../../../helpers';

type Props = {};

const Messages: FC<Props> = (props) => {
	const [show, setShow] = useState(false);

	return (
		<li className={`notifications dropdown ${outIf(show, 'show')}`}>
			<span className='counter bgc-blue'>3</span>
			<a
				href='/'
				className='dropdown-toggle no-after'
				onClick={(e) => {
					e.preventDefault();
					setShow(!show);
				}}>
				<i className='ti-email'></i>
			</a>
			<ul className={`dropdown-menu ${outIf(show, 'show')}`}>
				<li className='pX-20 pY-15 bdB'>
					<i className='ti-email pR-10'></i>
					<span className='fsz-sm fw-600 c-grey-900'>Messages</span>
				</li>
				<li>
					<ul className='ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm'>
						<li>
							<a href='/' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/1.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<div>
										<div className='peers jc-sb fxw-nw mB-5'>
											<div className='peer'>
												<p className='fw-500 mB-0'>John Doe</p>
											</div>
											<div className='peer'>
												<small className='fsz-xs'>5 mins ago</small>
											</div>
										</div>
										<span className='c-grey-600 fsz-sm'>
											Want to create your own customized data generator for your app...
										</span>
									</div>
								</div>
							</a>
						</li>
						<li>
							<a href='/' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/2.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<div>
										<div className='peers jc-sb fxw-nw mB-5'>
											<div className='peer'>
												<p className='fw-500 mB-0'>Moo Doe</p>
											</div>
											<div className='peer'>
												<small className='fsz-xs'>15 mins ago</small>
											</div>
										</div>
										<span className='c-grey-600 fsz-sm'>
											Want to create your own customized data generator for your app...
										</span>
									</div>
								</div>
							</a>
						</li>
						<li>
							<a href='/' className='peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100'>
								<div className='peer mR-15'>
									<img className='w-3r bdrs-50p' src='/https://randomuser.me/api/portraits/men/3.jpg' alt='' />
								</div>
								<div className='peer peer-greed'>
									<div>
										<div className='peers jc-sb fxw-nw mB-5'>
											<div className='peer'>
												<p className='fw-500 mB-0'>Lee Doe</p>
											</div>
											<div className='peer'>
												<small className='fsz-xs'>25 mins ago</small>
											</div>
										</div>
										<span className='c-grey-600 fsz-sm'>
											Want to create your own customized data generator for your app...
										</span>
									</div>
								</div>
							</a>
						</li>
					</ul>
				</li>
				<li className='pX-20 pY-15 ta-c bdT'>
					<span>
						<a href='/' className='c-grey-600 cH-blue fsz-sm td-n'>
							View All Email
							<i className='fs-xs ti-angle-right mL-10'></i>
						</a>
					</span>
				</li>
			</ul>
		</li>
	);
};

export default Messages;
