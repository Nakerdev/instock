import { Either, left, right } from "fp-ts/Either";

import { ValidationError } from "../types/validationError";
import { isEmpty } from "../utils/stringUtils";

export {
    Name,
    NamePersistenceState
}

class Name {

    private value: string;

    readonly state: NamePersistenceState;

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
        this.state = new NamePersistenceState(value);
    }
}

class NamePersistenceState {
    readonly value: string;

    constructor(value: string){
        this.value = value;
    }
}