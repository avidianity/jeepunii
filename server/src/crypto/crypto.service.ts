import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
	constructor(protected config: ConfigService) {}

	getKey() {
		return this.config.get<string>('KEY');
	}

	encrypt(data: any) {
		return JSON.stringify(data);
	}

	decrypt<T = any>(data: any): T {
		return JSON.parse(data);
	}
}
