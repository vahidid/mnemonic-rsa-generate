import * as bip39 from "bip39";
import { sha256 } from "js-sha256";

export class RNG {
	private seed: string;
	private rng: () => number;

	constructor(seed: string) {
		if (bip39.validateMnemonic(seed)) {
			seed = Buffer.from(bip39.mnemonicToSeedSync(seed)).toString("hex");
		} else {
			seed = sha256(seed);
		}
		this.seed = seed;
		this.rng = this.sfc32();
	}

	xmur3() {
		for (
			var i = 0, h = 1779033703 ^ this.seed.length;
			i < this.seed.length;
			i++
		) {
			h = Math.imul(h ^ this.seed.charCodeAt(i), 3432918353);
			h = (h << 13) | (h >>> 19);
		}

		return function () {
			h = Math.imul(h ^ (h >>> 16), 2246822507);
			h = Math.imul(h ^ (h >>> 13), 3266489909);
			return (h ^= h >>> 16) >>> 0;
		};
	}

	sfc32() {
		let seed = this.xmur3();
		let a = seed();
		let b = seed();
		let c = seed();
		let d = seed();
		return function () {
			a >>>= 0;
			b >>>= 0;
			c >>>= 0;
			d >>>= 0;
			var t = (a + b) | 0;
			a = b ^ (b >>> 9);
			b = (c + (c << 3)) | 0;
			c = (c << 21) | (c >>> 11);
			d = (d + 1) | 0;
			t = (t + d) | 0;
			c = (c + t) | 0;
			return (t >>> 0) / 4294967296;
		};
	}

	dec2Hex(dec: number) {
		return ("0" + dec.toString(16)).substr(-2);
	}

	random() {
		return this.rng();
	}

	randomRange(min: number, max: number) {
		return Math.floor(this.random() * (max - min + 1)) + min;
	}

	randomValues(array: Buffer) {
		for (var i = 0; i < array.length; i++) {
			array[i] = this.randomRange(0, 255);
		}
		return array;
	}

	randomBytes(size: number) {
		var buffer = Buffer.allocUnsafe(size);
		const randomBuffer = this.randomValues(buffer);
		return randomBuffer;
	}

	nextBytes(array: Buffer) {
		return this.randomValues(array);
	}
}
