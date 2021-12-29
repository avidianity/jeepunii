import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Rabbit as Crypto, enc } from 'crypto-js';

@Injectable()
export class CryptoService {
	constructor(protected config: ConfigService) {}

	getKey() {
		return this.config.get<string>('KEY')!;
	}

	encrypt(data: any) {
		return Crypto.encrypt(JSON.stringify(data), this.getKey()).toString();
	}

	decrypt<T = any>(data: any): T {
		return JSON.parse(
			Crypto.decrypt(data, this.getKey()).toString(enc.Utf8),
		);
	}
}
