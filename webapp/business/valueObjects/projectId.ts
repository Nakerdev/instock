import { Either, left, right } from 'fp-ts/Either'

import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'
import UuidService from '../security/cryptography/uuidService'

export {
  ProjectId,
  ProjectIdPersistenceState
}

class ProjectId {
  private value: string

  readonly state: ProjectIdPersistenceState

  static create (value: string): Either<ValidationError, ProjectId> {
    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }
    if (!this.isValidUuid(value)) {
      return left(ValidationError.InvalidFormat)
    }

    const projectId = new ProjectId(value)
    return right(projectId)
  }

  static createFromState (state: ProjectIdPersistenceState): ProjectId {
    return new ProjectId(state.value)
  }

  static newId (uuidService: UuidService): ProjectId {
    return new ProjectId(uuidService.create())
  }

  private constructor (value: string) {
    this.value = value
    this.state = new ProjectIdPersistenceState(value)
  }

  private static isValidUuid (value: string) {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return re.test(String(value).toLowerCase())
  }
}

class ProjectIdPersistenceState {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }
}
