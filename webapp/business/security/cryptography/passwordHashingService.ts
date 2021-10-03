import Password from "../../valueObjects/password";

export default interface PasswordHasingService {
    hash(plainPassword: Password): Password;
} 