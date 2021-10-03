import Validation from "./validation";
import { ValidationError } from "./validationError";
import { isEmpty } from "../utils/stringUtils";

export default class Name {

    private value: string;

    static create(value: string): Validation<ValidationError, Name> {
        
        const ALLOWED_MAX_LENGHT = 255;

        if(isEmpty(value)){
            return Validation.fail([ValidationError.Required]);
        }
        if(value.length >= ALLOWED_MAX_LENGHT){
            return Validation.fail([ValidationError.WrongLength]);
        }

        const name = new Name(value);
        return Validation.success(name);
    }

    private constructor(value: string){
        this.value = value;
    }
}