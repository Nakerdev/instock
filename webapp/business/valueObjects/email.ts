import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "../types/validationError";
import { isEmpty } from "../utils/stringUtils";

export {
    Email,
    EmailPersistenceState
}

class Email {

    private value: string;

    readonly state: EmailPersistenceState;

    static create(value: string): Either<ValidationError, Email> {
        
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return left(ValidationError.Required);
        }
        if(!this.isValidEmail(value)){
            return left(ValidationError.InvalidFormat);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return left(ValidationError.WrongLength);
        }

        const email = new Email(value);
        return right(email);
    }

    private constructor(value: string){
        this.value = value;
        this.state = new EmailPersistenceState(value);
    }

    private static isValidEmail(value: string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }
}

class EmailPersistenceState {
    readonly value: string;

    constructor(value: string){
        this.value = value;
    }
}