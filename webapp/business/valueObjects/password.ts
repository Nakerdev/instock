import { Either, left, right } from 'fp-ts/Either'

import PasswordHasingService from '../security/cryptography/passwordHashingService'
import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'

export {
  Password,
  PasswordPersistenceState
}

class Password {
  private value: string

  readonly state: PasswordPersistenceState

  static create (value: string): Either<ValidationError, Password> {
    const ALLOWED_MIN_LENGHT = 8
    const ALLOWED_MAX_LENGHT = 255

    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }
    if (value.length < ALLOWED_MIN_LENGHT || !this.isAStrongPassword(value)) {
      return left(ValidationError.InvalidFormat)
    }
    if (value.length >= ALLOWED_MAX_LENGHT) {
      return left(ValidationError.WrongLength)
    }

    const password = new Password(value)
    return right(password)
  }

  static createFromState (state: PasswordPersistenceState): Password {
    return new Password(state.value)
  }

  private constructor (value: string) {
    this.value = value
    this.state = new PasswordPersistenceState(value)
  }

  async hash (hashingService: PasswordHasingService): Promise<Password> {
    const hashedPassword = await hashingService.hash(this.value)
    return new Password(hashedPassword)
  }

  async compare (
    hashingService: PasswordHasingService,
    passwordIntent: Password
  ): Promise<boolean> {
    return await hashingService.compare(this.value, passwordIntent.value)
  }

  private static isAStrongPassword (value: string): boolean {
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value)
  }
}

class PasswordPersistenceState {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }
}
