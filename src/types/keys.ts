import { pki } from "node-forge";

export interface KeyType {
	privateKey: pki.rsa.PrivateKey;
	publicKey: pki.rsa.PublicKey;
}
