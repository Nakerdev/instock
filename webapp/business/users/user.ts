import Email from "../valueObjects/email";
import Password from "../valueObjects/password";
import Name from "../valueObjects/name";
import Surname from "../valueObjects/surname";

export default class User {
    readonly id: string;
    readonly email: Email;
    readonly password: Password;
    readonly name: Name;
    readonly surname: Surname;
    readonly signUpDate: Date;

    constructor(
        id: string, 
        email: Email, 
        password: Password,
        name: Name, 
        surname: Surname, 
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