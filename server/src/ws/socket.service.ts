import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RolesEnum, User } from 'src/models/user.entity';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import {
	EventNames,
	EventParams,
	EventsMap,
} from 'socket.io/dist/typed-events';

type Users = Array<{ user: User; id: string }>;

@Injectable()
export class SocketService {
	protected server: Server;
	protected connections = 0;
	protected users: Users = [];

	constructor(protected auth: AuthService, protected config: ConfigService) {}

	setServer(server: Server) {
		this.server = server;

		return this;
	}

	getServer() {
		return this.server;
	}

	setup(httpServer: any) {
		const io = new Server(httpServer, {
			cors: {
				credentials: true,
				origin: (origin, callback) => callback(null, origin),
			},
		});

		const driver = this.config.get<string>('SOCKET_DRIVER');

		if (driver === 'redis') {
			const pubClient = createClient({
				host: this.config.get<string>('REDIS_HOST'),
				port: this.config.get<number>('REDIS_PORT'),
			});
			const subClient = pubClient.duplicate();

			io.adapter(createAdapter(pubClient, subClient));
		}

		this.setServer(io).init();

		return io;
	}

	init() {
		this.server.use(async (socket, next) => {
			try {
				const header = String(socket.handshake.headers.authorization);

				const fragments = header.split(' ');

				if (fragments.length !== 2) {
					return next(new Error('Malformed authorization header.'));
				}

				const hash = fragments[2];

				const user = await this.auth.validateHash(hash);

				if (!user) {
					return next(new Error('Invalid token.'));
				}

				socket.user = user;

				return next();
			} catch (error) {
				return next(error);
			}
		});

		this.server.on('connection', (socket) => {
			this.connections++;
			this.users.push({ user: socket.user, id: socket.id });
			this.server.emit(`connect.${socket.user.id}`);

			socket.on('disconnect', () => {
				this.connections--;

				const index = this.users.findIndex(
					(item) => item.id === socket.id,
				);
				this.users.splice(index, 1);

				this.server.emit(`disconnect.${socket.user.id}`);
			});
		});
	}

	emit<Ev extends EventNames<EventsMap>>(
		ev: Ev,
		...args: EventParams<EventsMap, Ev>
	): boolean {
		return this.server.emit(ev, ...args);
	}

	count() {
		return this.connections;
	}
}
