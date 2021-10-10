import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "./validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Surname {

    private value: string;

    static create(value: string): Either<ValidationError, Surname> {
        
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return left(ValidationError.Required);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return left(ValidationError.WrongLength);
        }

        const surname = new Surname(value);
        return right(surname);
    }

    private constructor(value: string){
        this.value = value;
    }
}