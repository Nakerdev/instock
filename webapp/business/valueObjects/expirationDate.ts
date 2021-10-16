import { Either, left, right } from 'fp-ts/Either'

import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'
import TimeService from '../infraestructure/timeService'

export {
  ExpirationDate
}

class ExpirationDate {
  private value: Date

  static create (value: string): Either<ValidationError, ExpirationDate> {
    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }
    if (!this.isValidDate(value)) {
      return left(ValidationError.InvalidFormat)
    }

    const date = new Date()
    date.setTime(Date.parse(value))
    const expirationDate = new ExpirationDate(date)
    return right(expirationDate)
  }

  constructor (value: Date) {
    this.value = value
  }

  isExpired (timeService: TimeService): boolean {
    return this.value < timeService.utcNow()
  }

  private static isValidDate (value: string): boolean {
    try {
      return !isNaN(Date.parse(value))
    } catch {
      return false
    }
  }
}
