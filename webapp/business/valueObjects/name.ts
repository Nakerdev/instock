import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "../types/validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Name {

    private value: string;

    static create(value: string): Either<ValidationError, Name> {
        
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return left(ValidationError.Required);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return left(ValidationError.WrongLength);
        }

        const name = new Name(value);
        return right(name);
    }

    private constructor(value: string){
        this.value = value;
    }
}