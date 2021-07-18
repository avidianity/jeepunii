import axios from 'axios';
import './shims';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { State } from './libraries/State';
import config from './localconfig.json';

const vars = process.env.NODE_ENV === 'production' ? config.prod : config.dev;

axios.defaults.baseURL = `${vars.schema}://${vars.address}${vars.port ? `:${vars.port}` : ''}`;

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
