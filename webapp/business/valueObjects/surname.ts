import { Either, left, right } from 'fp-ts/Either'

import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'

export {
  Surname,
  SurnamePersistenceState
}

class Surname {
  private value: string

  readonly state: SurnamePersistenceState

  static create (value: string): Either<ValidationError, Surname> {
    const ALLOWED_MAX_LENGHT = 255

    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }
    if (value.length >= ALLOWED_MAX_LENGHT) {
      return left(ValidationError.WrongLength)
    }

    const surname = new Surname(value)
    return right(surname)
  }

  static createFromState (state: SurnamePersistenceState): Surname {
    return new Surname(state.value)
  }

  private constructor (value: string) {
    this.value = value
    this.state = new SurnamePersistenceState(value)
  }
}

class SurnamePersistenceState {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }
}
