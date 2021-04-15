import axios from 'axios';
import './shims';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { State } from './libraries/State';

axios.defaults.baseURL = `http://192.168.254.101:8000`;

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
