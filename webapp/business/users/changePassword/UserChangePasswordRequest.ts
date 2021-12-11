import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'
import { UserId } from '../../valueObjects/userId'
import { Password } from '../../valueObjects/password'
import { ExpirationDate } from '../../valueObjects/expirationDate'

export {
  UserChangePasswordRequest,
  UserChangePasswordRequestDto
}

class UserChangePasswordRequest {
  readonly userId: UserId
  readonly password: Password
  readonly passwordChangePetitionExpirationDate: ExpirationDate

  static create (requestDto: UserChangePasswordRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        UserChangePasswordRequest
    > {
    const userIdValidationResult = UserId.create(requestDto.userId)
    const passwordValidationResult = Password.create(requestDto.password)
    const expirationDateValidationResult = ExpirationDate.create(requestDto.passwordChangePetitionExpirationDate)

    if (isLeft(userIdValidationResult) ||
      isLeft(passwordValidationResult) ||
      isLeft(expirationDateValidationResult)) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), () => 0))
      pipe(passwordValidationResult, match(error => formValidations.push(new FormValidationError('password', error)), () => 0))
      pipe(expirationDateValidationResult, match(error => formValidations.push(new FormValidationError('passwordChangePetitionExpirationDate', error)), () => 0))
      return left(formValidations)
    }

    const request = new UserChangePasswordRequest(
      userIdValidationResult.right,
      passwordValidationResult.right,
      expirationDateValidationResult.right
    )
    return right(request)
  }

  private constructor (
    userId: UserId,
    password: Password,
    passwordChangePetitionExpirationDate: ExpirationDate
  ) {
    this.userId = userId
    this.password = password
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}

class UserChangePasswordRequestDto {
  readonly userId: string
  readonly password: string
  readonly passwordChangePetitionExpirationDate: string

  constructor (
    userId: string,
    password: string,
    passwordChangePetitionExpirationDate: string
  ) {
    this.userId = userId.trim()
    this.password = password.trim()
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate.trim()
  }
}
