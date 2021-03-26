import { createContext } from 'react';
import { EventBus } from './libraries/EventBus';

export const EventContext = createContext<{
	AuthBus: EventBus;
}>(null as any);

export const AuthContext = createContext<{
	logged: boolean;
	setLogged: (value: boolean) => void;
}>(null as any);
