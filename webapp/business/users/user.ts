import { Email, EmailPersistenceState } from '../valueObjects/email'
import { Password, PasswordPersistenceState } from '../valueObjects/password'
import { Name, NamePersistenceState } from '../valueObjects/name'
import { Surname, SurnamePersistenceState } from '../valueObjects/surname'

export {
  User,
  UserPersistenceState
}

class User {
  readonly id: string
  readonly email: Email
  readonly password: Password
  readonly name: Name
  readonly surname: Surname
  readonly signUpDate: Date

  readonly state: UserPersistenceState

  static createFromState (state: UserPersistenceState) {
    return new User(
      state.id,
      Email.createFromState(state.email),
      Password.createFromState(state.password),
      Name.createFromState(state.name),
      Surname.createFromState(state.surname),
      state.signUpDate
    )
  }

  constructor (
    id: string,
    email: Email,
    password: Password,
    name: Name,
    surname: Surname,
    signUpDate: Date
  ) {
    this.id = id
    this.email = email
    this.name = name
    this.surname = surname
    this.password = password
    this.signUpDate = signUpDate
    this.state = new UserPersistenceState(
      this.id,
      this.email.state,
      this.password.state,
      this.name.state,
      this.surname.state,
      this.signUpDate
    )
  }
}

class UserPersistenceState {
  readonly id: string
  readonly email: EmailPersistenceState
  readonly password: PasswordPersistenceState
  readonly name: NamePersistenceState
  readonly surname: SurnamePersistenceState
  readonly signUpDate: Date

  constructor (
    id: string,
    email: EmailPersistenceState,
    password: PasswordPersistenceState,
    name: NamePersistenceState,
    surname: SurnamePersistenceState,
    signUpDate: Date
  ) {
    this.id = id
    this.email = email
    this.password = password
    this.name = name
    this.surname = surname
    this.signUpDate = signUpDate
  }
}
