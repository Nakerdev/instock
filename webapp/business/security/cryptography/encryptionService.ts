export default interface EncryptionService {
    encrypt(text: string): EncryptedResult;
    decrypt(encryptedResult: EncryptedResult): string;
}

export class EncryptedResult {
    readonly iv: string;
    readonly data: string;

    constructor(iv: string, data: string){
        this.iv = iv;
        this.data = data;
    }
}