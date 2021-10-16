import { User } from "../../../../business/users/user";
import { Email, EmailPersistenceState } from "../../../../business/valueObjects/email";
import { Password, PasswordPersistenceState } from "../../../../business/valueObjects/password";
import { Name, NamePersistenceState } from "../../../../business/valueObjects/name";
import { Surname, SurnamePersistenceState } from "../../../../business/valueObjects/surname";

interface UserBuilderParams {
    password?: string;
}

    export default function buildUser ({
      password = 'hashed-password'
    }: UserBuilderParams): User {
      return new User(
        'id',
        Email.createFromState(new EmailPersistenceState('user@email.com')),
        Password.createFromState(new PasswordPersistenceState(password)),
        Name.createFromState(new NamePersistenceState('Alvaro')),
        Surname.createFromState(new SurnamePersistenceState('Gonzalez')),
        new Date(2021, 10, 10)
      )
    }