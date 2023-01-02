import { assert } from "chai";
import RSAKey from "../index";
import { pki } from "node-forge";

describe("RSA", () => {
	it("generate RSA keypair", (done) => {
		const seed =
			"stadium tuna visit chunk ladder please volume ecology brave fabric camera resource";
		const key = new RSAKey(seed);
		key.generate(2048).then((generatedKey) => {
			const pemPublic = pki
				.publicKeyToPem(generatedKey.publicKey)
				.replace("-----BEGIN PUBLIC KEY-----", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replace(/(\n|\r)/g, "");

			assert.equal(
				pemPublic,
				`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoxe53/uyCz2ZGZMIiQ4ytr2sjnpHI9gmrdVzdNssZ5jtwYRJSsBg8EzEnI5k5DIKxtCaqGO04HbgAeyV5T/qoPz79OVQZP4kv2waOMi8BK237dg6lJ0Qs7idHNcalResXseJOEWgJv+fEI8nhHJqjiLa95m2KJyBP2Tjfp4l4RVdXYTzgOEf9C8SB6o/JXjcHTpBGlybwaBApHXJbWFtYslgxe+Ic0ZZhqIohq4RpS++tW0eToabnbbZIpgbHHiapzateayHJ15m6L6iOo5Ez5b5yI1vXc+dAOj9AjNHgl4Bbslj/Xqh+6X/As2vNVWKT0Vqy6aBmpLKZ5ODCVv0sQIDBlU3`
			);
			done();
		});
	});
});
