import { assert } from "chai";
import { RSAKey } from "../lib/rsa";
import { pki } from "node-forge";

describe("RSA", () => {
	it("generate RSA keypair", (done) => {
		const seed =
			"midnight kiwi smooth convince web skate base future possible upgrade slim never";
		const key = new RSAKey(seed);
		key.generate(2048).then((generatedKey) => {
			const pemPublic = pki
				.publicKeyToPem(generatedKey.publicKey)
				.replace("-----BEGIN PUBLIC KEY-----", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replace(/(\n|\r)/g, "");

			console.log(pemPublic);

			assert.equal(
				pemPublic,
				`MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB4bmmQsvRZd0jecBB8z/CLKaz3kFbQQ5oav6HbiBwKMiW2tEp1kPSfRLs/FAT+g3xB+QBpsBE05U2045x8oaTCpVYL4S5pePKNdbhVJlducwVLfQlC3fttqCRRMYkem7Eo/c41rbYHXzYi8AVU8tMbOvBZbWCCefoL9PuRIhIyCngyXZbv5NlI+XFzR9+ndLaXCKJAW9bUrJGa2nlqvPHCBs3cZNpgK/AOwp8GRfxnV7NE3YJ5uAhAN129GSZQ9wTGfCvALuw6kB9QyoocHcuPHZIp/pSk0rP8bQVZlLdZTGLLKK6wXtX8bcyPLz7nmrzZebhHLCR6SW1cVtGlxzNvAgMGVTc=`
			);
			done();
		});
	});
});
