import Validation from "./validation";
import { ValidationError } from "./validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Password {

    private value: string;

    static create(value: string): Validation<ValidationError, Password> {
        
        const ALLOWED_MIN_LENGHT = 8;
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return Validation.fail([ValidationError.Required]);
        }
        if(value.length < ALLOWED_MIN_LENGHT || !this.isAStrongPassword(value)){
            return Validation.fail([ValidationError.InvalidFormat]);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return Validation.fail([ValidationError.WrongLength]);
        }

        const name = new Password(value);
        return Validation.success(name);
    }

    private constructor(value: string){
        this.value = value;
    }

    static isAStrongPassword(value: string): boolean {
        return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)
    }
}