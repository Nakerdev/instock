export default interface PasswordHasingService {
    hash(plainPassword: string): Promise<string>;
} 