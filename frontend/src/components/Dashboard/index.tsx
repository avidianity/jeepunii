import React, { FC } from 'react';
import Footer from './Shared/Footer';
import Navbar from './Shared/Navbar';
import Sidebar from './Shared/Sidebar';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	return (
		<>
			<Sidebar />
			<div className='page-container'>
				<Navbar />
				<main className='main-content bgc-grey-100'>
					<div id='mainContent'>
						<div className='full-container'></div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default Dashboard;
