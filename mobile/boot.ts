import axios from 'axios';
import './shims';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { State } from './libraries/State';
import { SERVER_URL } from './constants';

axios.defaults.baseURL = SERVER_URL;

axios.defaults.headers.common['Accept'] = 'application/json';

const state = State.getInstance();

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

(async () => {
	if (await state.has('token')) {
		const token = await state.get<string>('token');
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
})();
