import toastr from 'toastr';
import axios from 'axios';
import './shims';
import { State } from './libraries/State';
import $ from 'jquery';
import 'bootstrap';
import { SERVER_URL } from './constants';

window.toastr = toastr;
window.$ = $;
window.jQuery = $;

axios.defaults.baseURL = SERVER_URL;

axios.defaults.headers.common['Accept'] = 'application/json';

const state = State.getInstance();

if (state.has('token')) {
	const token = state.get('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
