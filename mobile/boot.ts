import axios, { AxiosError } from 'axios';
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
	const token = await state.get<string>('token');
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
})();

axios.interceptors.request.use(async (config) => {
	const token = await state.get<string>('token');
	if (token) {
		config.headers.common['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

axios.interceptors.response.use(
	(r) => r,
	(e: AxiosError) => {
		console.log({
			url: e.config?.url,
			headers: e.response?.headers,
			response: e.response?.data,
			status: e.response?.status,
		});
		return Promise.reject(e);
	}
);
