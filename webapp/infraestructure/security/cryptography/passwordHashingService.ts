import bcrypt from "bcrypt";

import PasswordHasingService from "../../../business/security/cryptography/passwordHashingService";
import { Password } from "../../../business/valueObjects/password";

export default class BCryptPasswordHasingService implements PasswordHasingService {
    async hash(plainPassword: Password): Promise<Password> {
        const pass = plainPassword.getValue();
        const hash = await bcrypt.hash(pass, 10);
        return Password.createFromBusiness(hash);
    };
} 