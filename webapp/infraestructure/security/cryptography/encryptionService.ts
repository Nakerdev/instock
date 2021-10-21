import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

import EncryptionService, {EncryptedResult} from "../../../business/security/cryptography/encryptionService";

export default class Aes256EncryptionService implements EncryptionService{

    private readonly encryptionKey: string

    private readonly SHA256_ALGORITHMS_NAME = "sha256";

    constructor(encryptionKey: string){
        this.encryptionKey = encryptionKey
    }

    encrypt(text: string): EncryptedResult {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.SHA256_ALGORITHMS_NAME, Buffer.from(this.encryptionKey), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return new EncryptedResult(iv.toString('hex'), encrypted.toString('hex'));
    }    
    
    decrypt(encryptedResult: EncryptedResult): string {
        const iv = Buffer.from(encryptedResult.iv, 'hex');
        const encryptedText = Buffer.from(encryptedResult.data, 'hex');
        const decipher = createDecipheriv(this.SHA256_ALGORITHMS_NAME, Buffer.from(this.encryptionKey), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}