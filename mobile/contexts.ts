import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { JeepContract } from './contracts/jeep.contract';
import { UserContract } from './contracts/user.contract';

export const AuthContext = createContext({
	user: {} as UserContract | null,
	setUser(user: UserContract | null) {},
	token: '',
	setToken(token: string) {},
});

export const ThemeContext = createContext({
	dark: false,
	setDark(dark: boolean) {},
});

export const JeepContext = createContext({
	jeep: {} as JeepContract | null,
	setJeep(jeep: JeepContract | null) {},
});

export const SocketContext = createContext({
	socket: {} as Socket | null,
	setSocket(socket: Socket) {},
});
