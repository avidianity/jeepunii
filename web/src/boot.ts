import toastr from 'toastr';
import axios from 'axios';
import './shims';
import { State } from './libraries/State';

window.toastr = toastr;

axios.defaults.baseURL = `${process.env.REACT_APP_SERVER_URL}`;

axios.defaults.headers.common['Accept'] = 'application/json';

const state = State.getInstance();

if (state.has('token')) {
	const token = state.get('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
