import { Either, left, right } from "fp-ts/Either";

import Email from "../../valueObjects/email";
import Name from "../../valueObjects/name";
import Surname from "../../valueObjects/surname";
import Password from "../../valueObjects/password";
import { ValidationError } from "../../valueObjects/validationError";
import FormValidationError from "../../valueObjects/formValidationError";

export {
    UserSignUpRequest,
    UserSignUpRequestDto
}

class UserSignUpRequest {

    readonly email: Email;
    readonly name: Name;
    readonly surname: Surname;
    readonly password: Password;

    static create(requestDto: UserSignUpRequestDto): Either<
        Array<FormValidationError<ValidationError>>, 
        UserSignUpRequest
    > {

        const emailValidation = Email.create(requestDto.email);
        const nameValidation = Name.create(requestDto.name);
        const surnameValidation = Surname.create(requestDto.surname);
        const passwordValidation = Password.create(requestDto.password);

        if(
            emailValidation.isFail()
            || nameValidation.isFail()
            || surnameValidation.isFail()
            || passwordValidation.isFail()
            || !requestDto.areLegalTermsAndConditionsAccepted
        ){
            const emailFails: FormValidationError<ValidationError>[] = FormValidationError.create("email", emailValidation.getFails());
            const nameFails: FormValidationError<ValidationError>[] = FormValidationError.create("name", nameValidation.getFails());
            const surnameFails: FormValidationError<ValidationError>[] = FormValidationError.create("surname", surnameValidation.getFails());
            const passwordFails: FormValidationError<ValidationError>[] = FormValidationError.create("password", passwordValidation.getFails());
            const legalTermsAndConditions: FormValidationError<ValidationError>[] = !requestDto.areLegalTermsAndConditionsAccepted
                ? FormValidationError.create("legalTermsAndConditions", [ValidationError.Required])
                : [];
            const formValidations = emailFails
                .concat(nameFails)
                .concat(surnameFails)
                .concat(passwordFails)
                .concat(legalTermsAndConditions);
            return left(formValidations);
        }

        const request = new UserSignUpRequest(
            emailValidation.getSuccess(),
            nameValidation.getSuccess(),
            surnameValidation.getSuccess(),
            passwordValidation.getSuccess()
        );
        return right(request);
    }

    private constructor(
        email: Email,
        name: Name, 
        surname: Surname, 
        password: Password, 
    ) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
    }
}

class UserSignUpRequestDto {
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly password: string;
    readonly areLegalTermsAndConditionsAccepted: boolean;

    constructor(
        email: string,
        name: string, 
        surname: string, 
        password: string, 
        areLegalTermsAndConditionsAccepted: boolean
    ) {
        this.email = email.trim();
        this.name = name.trim();
        this.surname = surname.trim();
        this.password = password;
        this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted;
    }
}