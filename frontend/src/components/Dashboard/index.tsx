import React, { FC, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { v4 } from 'uuid';
import { EventContext } from '../../contexts';
import { routes } from '../../routes';
import Footer from './Shared/Footer';
import Navbar from './Shared/Navbar';
import Sidebar from './Shared/Sidebar';

type Props = {};

const Dashboard: FC<Props> = (props) => {
	const history = useHistory();
	const { AuthBus } = useContext(EventContext);

	const fetchRequirements = (id: string) => {
		['/loader.js', '/bundle.js'].forEach((url) => {
			const script = document.createElement('script');
			script.src = `${process.env.PUBLIC_URL}${url}`;
			script.defer = true;
			script.type = 'text/javascript';
			script.setAttribute('data-id', id);
			document.body.append(script);
		});
	};

	useEffect(() => {
		const id = v4();
		fetchRequirements(id);

		const key = AuthBus.listen('logout', () => {
			history.push(routes.LOGIN);
		});

		return () => {
			AuthBus.unlisten(key);
			document.querySelectorAll(`[data-id="${id}"]`)?.forEach((element) => element.remove());
		};
		// eslint-disable-next-line
	}, []);

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
