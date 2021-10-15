import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { Email } from '../../valueObjects/email'
import { Password } from '../../valueObjects/password'
import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'

export {
  UserLoginRequest,
  UserLoginRequestDto
}

class UserLoginRequest {
  readonly email: Email
  readonly password: Password

  static create (requestDto: UserLoginRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        UserLoginRequest
    > {
    const emailValidationResult = Email.create(requestDto.email)
    const passwordValidationResult = Password.create(requestDto.password)

    if (isLeft(emailValidationResult) || isLeft(passwordValidationResult)) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(emailValidationResult, match(error => formValidations.push(new FormValidationError('email', error)), _ => 0))
      pipe(passwordValidationResult, match(error => formValidations.push(new FormValidationError('password', error)), _ => 0))
      return left(formValidations)
    }

    const request = new UserLoginRequest(emailValidationResult.right, passwordValidationResult.right)
    return right(request)
  }

  private constructor (
    email: Email,
    password: Password
  ) {
    this.email = email
    this.password = password
  }
}

class UserLoginRequestDto {
  readonly email: string
  readonly password: string

  constructor (
    email: string,
    password: string
  ) {
    this.email = email.trim()
    this.password = password
  }
}
