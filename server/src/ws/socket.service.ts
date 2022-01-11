import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/models/user.entity';
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
	protected sockets = new Map<string, Socket>();

	constructor(protected auth: AuthService, protected config: ConfigService) {}

	setServer(server: Server) {
		this.server = server;

		return this;
	}

	getServer() {
		return this.server;
	}

	hasUser(user: User) {
		const exists = this.users.find((item) => item.user.id === user.id);

		return exists ? true : false;
	}

	setup(httpServer: any) {
		const io = new Server(httpServer, {
			cors: {
				credentials: true,
				origin: (origin, callback) => callback(null, origin),
			},
			pingInterval: 7500,
			pingTimeout: 5000,
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
				let header = '';

				if (
					socket.handshake.headers['authorization'] ||
					typeof socket.handshake.headers['authorization'] ===
						'string'
				) {
					header = socket.handshake.headers['authorization'];
				} else if (
					socket.request.headers['authorization'] &&
					typeof socket.request.headers['authorization'] === 'string'
				) {
					header = socket.request.headers['authorization'];
				}

				const fragments = header.split(' ');

				if (fragments.length !== 2) {
					return next(new Error('Malformed authorization header.'));
				}

				const hash = fragments[1];

				const user = await this.auth.validateHash(hash);

				if (!user) {
					return next(new Error('Invalid token.'));
				}

				socket.user = user;

				return next();
			} catch (error: any) {
				return next(error);
			}
		});

		this.server.on('connection', async (socket) => {
			this.connections++;

			const { user } = socket;

			this.users.push({ user, id: socket.id });
			this.emit(`connect.${user.id}`);

			user.online = true;
			await user.save();

			socket.on('ping', () => {
				socket.emit('pong');
			});

			this.sockets.set(socket.id, socket);

			socket.on('disconnect', async () => {
				this.connections--;

				user.online = false;
				await user.save();

				const index = this.users.findIndex(
					(item) => item.user.id === user.id,
				);

				if (index > 0) {
					this.users.splice(index, 1);
				}

				this.sockets.delete(socket.id);

				this.emit(`disconnect.${user.id}`);
			});
		});
	}

	emit<Ev extends EventNames<EventsMap>>(
		ev: Ev,
		...args: EventParams<EventsMap, Ev>
	): void {
		this.sockets.forEach((socket) => socket.emit(ev, ...args));
	}

	count() {
		return this.connections;
	}
}
