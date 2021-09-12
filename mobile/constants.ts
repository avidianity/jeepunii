import { RolesEnum } from './contracts/user.contract';
import config from './localconfig.json';

const vars = ((mode: string) => {
	switch (mode) {
		case 'dev':
			return config.dev;
		case 'prod':
			return config.prod;
		case 'staging':
			return config.staging;
		default:
			throw new Error();
	}
})(config.mode);

export const APP_NAME = process.env.REACT_APP_NAME || 'Jeepunii';

export const RoleColorMap = {
	[RolesEnum.ADMIN]: 'danger',
	[RolesEnum.COOPERATIVE]: 'primary',
	[RolesEnum.DRIVER]: 'success',
	[RolesEnum.PASSENGER]: 'warning',
};

export const SERVER_URL = `${vars.schema}://${vars.address}${vars.port !== false ? `:${vars.port}` : ''}`;

export const Roles = [RolesEnum.ADMIN, RolesEnum.COOPERATIVE, RolesEnum.DRIVER, RolesEnum.PASSENGER];

export const Colors = {
	primary: '#16518c',
	secondary: '#b9baa3',
	success: '#18b925',
	warning: '#fffd98',
	danger: '#db5461',
	info: '#0acdff',
	dark: '#162521',
	light: '#fff',
};
