import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "../types/validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Password {

    private value: string;

    static create(value: string): Either<ValidationError, Password> {
        
        const ALLOWED_MIN_LENGHT = 8;
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return left(ValidationError.Required);
        }
        if(value.length < ALLOWED_MIN_LENGHT || !this.isAStrongPassword(value)){
            return left(ValidationError.InvalidFormat);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return left(ValidationError.WrongLength);
        }

        const password = new Password(value);
        return right(password);
    }

    static createFromBusiness(value: string): Password {
        return new Password(value);
    }

    private constructor(value: string){
        this.value = value;
    }

    getValue(): string{
        return this.value;
    }

    private static isAStrongPassword(value: string): boolean {
        return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)
    }
}