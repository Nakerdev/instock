export default class User {
    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly name: string;
    readonly surname: string;
    readonly signUpDate: Date;

    constructor(
        id: string, 
        email: string, 
        password: string,
        name: string, 
        surname: string, 
        signUpDate: Date
    ) {

        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.signUpDate = signUpDate;
    }
}