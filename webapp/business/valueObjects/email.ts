import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "./validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Email {

    private value: string;

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
    }

    private static isValidEmail(value: string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }
}