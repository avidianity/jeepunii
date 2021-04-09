import { createContext } from 'react';
import { UserContract } from './contracts/user.contract';
import { EventBus } from './libraries/EventBus';

export const EventContext = createContext<{
	AuthBus: EventBus;
}>(null as any);

export const AuthContext = createContext<{
	logged: boolean;
	setLogged: (value: boolean) => void;
	user: UserContract | null;
	setUser: (user: UserContract | null) => void;
}>(null as any);
