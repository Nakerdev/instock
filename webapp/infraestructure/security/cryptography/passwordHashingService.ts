import bcrypt from "bcrypt";

import PasswordHasingService from "../../../business/security/cryptography/passwordHashingService";

export default class BCryptPasswordHasingService implements PasswordHasingService {

    async hash(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, 10);
    };
} 