import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {
	constructor(protected config: ConfigService) {}

	getKey() {
		return this.config.get<string>('KEY');
	}

	encrypt(data: any) {
		return CryptoJS.AES.encrypt(
			JSON.stringify(data),
			this.getKey(),
		).toString();
	}

	decrypt(data: any) {
		const bytes = CryptoJS.AES.decrypt(data, this.getKey());
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	}
}
