import { KeyType } from "../types/keys";
import { RNG } from "./rng";
import { jsbn, pki } from "node-forge";

const BigInteger = jsbn.BigInteger;

export class RSAKey {
	private n: jsbn.BigInteger;
	private e: number;
	private d: jsbn.BigInteger;
	private p: jsbn.BigInteger;
	private q: jsbn.BigInteger;
	private dmp1: jsbn.BigInteger;
	private dmq1: jsbn.BigInteger;
	private coeff: jsbn.BigInteger;
	private seed: string;
	private rng: RNG | jsbn.RandomGenerator;

	constructor(seed: string) {
		this.n = null;
		this.e = 0;
		this.d = null;
		this.p = null;
		this.q = null;
		this.dmp1 = null;
		this.dmq1 = null;
		this.coeff = null;
		this.seed = seed;
		this.rng = new RNG(seed);
	}

	async _getRandomBN(length: number): Promise<jsbn.BigInteger> {
		const self = this;
		return new Promise(function (resolve, reject) {
			try {
				let num = new BigInteger(length, 1, self.rng as jsbn.RandomGenerator);
				resolve(num);
			} catch (e) {
				reject(e);
			}
		});
	}

	async _isValid(num: any, exponent: jsbn.BigInteger): Promise<boolean> {
		return new Promise(function (resolve, reject) {
			try {
				resolve(
					num
						.subtract(BigInteger.ONE)
						.gcd(exponent)
						.compareTo(BigInteger.ONE) == 0 && num.isProbablePrime(10)
				);
			} catch (e) {
				reject(e);
			}
		});
	}

	async _getPrime(
		length: number,
		exponent: jsbn.BigInteger
	): Promise<jsbn.BigInteger> {
		const self = this;
		return new Promise(async function (resolve, reject) {
			try {
				let valid = false;
				let num;
				while (!valid) {
					num = await self._getRandomBN(length);
					valid = await self._isValid(num, exponent);
				}
				resolve(num);
			} catch (e) {
				reject(e);
			}
		});
	}

	async generate(B: number, E: string) {
		const self = this;
		return new Promise(async function (resolve, reject) {
			try {
				//key size
				B = B || 2048;
				//exponent
				E = E || "65537";
				const qs = B >> 1;
				self.e = parseInt(E, 16);
				const exponent = new BigInteger(E, 16);

				let valid = false;

				while (!valid) {
					self.p = await self._getPrime(B - qs, exponent);
					self.q = await self._getPrime(qs, exponent);

					if (self.p.compareTo(self.q) <= 0) {
						//swap values
						let t = self.p;
						self.p = self.q;
						self.q = t;
					}

					let p1 = self.p.subtract(BigInteger.ONE);
					let q1 = self.q.subtract(BigInteger.ONE);
					let phi = p1.multiply(q1);

					if (phi.gcd(exponent).compareTo(BigInteger.ONE) == 0) {
						self.n = self.p.multiply(self.q);
						self.d = exponent.modInverse(phi);
						self.dmp1 = self.d.mod(p1);
						self.dmq1 = self.d.mod(q1);
						self.coeff = self.q.modInverse(self.p);
						valid = true;
					}
				}
				var bigint_e = new BigInteger(null);
				// bigint_e.fromInt(self.e);
				var pr = pki.rsa.setPrivateKey(
					self.n,
					bigint_e,
					self.d,
					self.p,
					self.q,
					self.dmp1,
					self.dmq1,
					self.coeff
				);
				var pb = pki.rsa.setPublicKey(self.n, bigint_e);
				pki.rsa.generateKeyPair;
				let key = {} as KeyType;
				key.privateKey = pr;
				key.publicKey = pb;
				resolve(key);
			} catch (error) {
				reject(error);
			}
		});
	}
}
