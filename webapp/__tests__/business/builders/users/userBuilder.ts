import { User } from '../../../../business/users/user'
import { UserId, UserIdPersistenceState } from '../../../../business/valueObjects/userId'
import { Email, EmailPersistenceState } from '../../../../business/valueObjects/email'
import { Password, PasswordPersistenceState } from '../../../../business/valueObjects/password'
import { Name, NamePersistenceState } from '../../../../business/valueObjects/name'
import { Surname, SurnamePersistenceState } from '../../../../business/valueObjects/surname'

interface UserBuilderParams {
    password?: string;
}

export default function buildUser ({
  password = 'hashed-password'
}: UserBuilderParams): User {
  return new User(
    UserId.createFromState(new UserIdPersistenceState('deb74e35-ea5f-535f-890f-5779b5d8e27f')),
    Email.createFromState(new EmailPersistenceState('user@email.com')),
    Password.createFromState(new PasswordPersistenceState(password)),
    Name.createFromState(new NamePersistenceState('Alvaro')),
    Surname.createFromState(new SurnamePersistenceState('Gonzalez')),
    new Date(2021, 10, 10)
  )
}
