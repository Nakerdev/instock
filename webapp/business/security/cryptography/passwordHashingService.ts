export default interface PasswordHasingService {
    hash(plainPassword: string): string;
} 