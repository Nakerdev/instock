import { Either, left, right } from 'fp-ts/Either'

import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'
import UuidService from '../security/cryptography/uuidService'

export {
  UserId,
  UserIdPersistenceState
}

class UserId {
  private value: string

  readonly state: UserIdPersistenceState

  static create (value: string): Either<ValidationError, UserId> {
    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }
    if (!this.isValidUuid(value)) {
      return left(ValidationError.InvalidFormat)
    }

    const userId = new UserId(value)
    return right(userId)
  }

  static createFromState (state: UserIdPersistenceState): UserId {
    return new UserId(state.value)
  }

  static newId (uuidService: UuidService): UserId {
    return new UserId(uuidService.create())
  }

  private constructor (value: string) {
    this.value = value
    this.state = new UserIdPersistenceState(value)
  }

  private static isValidUuid (value: string) {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return re.test(String(value).toLowerCase())
  }
}

class UserIdPersistenceState {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }
}
