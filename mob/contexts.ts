import { createContext } from 'react';
import { UserContract } from './contracts/user.contract';

export const AuthContext = createContext({
	user: {} as UserContract | null,
	setUser(user: UserContract | null) {},
});

export const ThemeContext = createContext({
	dark: false,
	setDark(dark: boolean) {},
});
