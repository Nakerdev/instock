export default class UserSignUpRequest {
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly password: string;
    readonly areLegalTermsAndConditionsAccepted: boolean;

    static create(
        email: string,
        name: string, 
        surname: string, 
        password: string, 
        areLegalTermsAndConditionsAccepted: boolean
    ): UserSignUpRequest {
        throw new Error("not implemented")
    }

    constructor( //TODO: make it private
        email: string,
        name: string, 
        surname: string, 
        password: string, 
        areLegalTermsAndConditionsAccepted: boolean //TODO: delete it
    ) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted;
    }
}
