import { RolesEnum } from './contracts/user.contract';

export const APP_NAME = process.env.REACT_APP_NAME || 'Paymento';

export const RoleColorMap = {
	[RolesEnum.ADMIN]: 'danger',
	[RolesEnum.COOPERATIVE]: 'primary',
	[RolesEnum.DRIVER]: 'success',
	[RolesEnum.PASSENGER]: 'warning',
};

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
