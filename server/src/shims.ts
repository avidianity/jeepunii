import { randomBytes } from 'crypto';

String.random = (size = 40) => randomBytes(size).toString('hex').slice(0, size);

String.prototype.toNumber = function () {
	const parts = this.split('.');
	if (parts.length > 1) {
		const whole = (parts[0].match(/\d/g) || []).join('');
		const decimals = (parts[1].match(/\d/g) || []).join('');
		return Number(`${whole}.${decimals}`) || 0;
	}
	const match = this.match(/\d/g);
	if (!match) {
		return 0;
	}
	return Number(match.join('')) || 0;
};
