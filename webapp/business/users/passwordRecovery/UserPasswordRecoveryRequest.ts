import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { Email } from '../../valueObjects/email'
import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'

export {
  UserPasswordRecoveryRequest,
  UserPasswordRecoveryRequestDto
}

class UserPasswordRecoveryRequest {
  readonly email: Email

  static create (requestDto: UserPasswordRecoveryRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        UserPasswordRecoveryRequest
    > {
    const emailValidationResult = Email.create(requestDto.email)

    if (isLeft(emailValidationResult)) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(emailValidationResult, match(error => formValidations.push(new FormValidationError('email', error)), () => 0))
      return left(formValidations)
    }

    const request = new UserPasswordRecoveryRequest(emailValidationResult.right)
    return right(request)
  }

  private constructor (
    email: Email
  ) {
    this.email = email
  }
}

class UserPasswordRecoveryRequestDto {
  readonly email: string

  constructor (
    email: string
  ) {
    this.email = email.trim()
  }
}
