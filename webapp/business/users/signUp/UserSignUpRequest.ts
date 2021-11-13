import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { Email } from '../../valueObjects/email'
import { Name } from '../../valueObjects/name'
import { Surname } from '../../valueObjects/surname'
import { Password } from '../../valueObjects/password'
import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'

export {
  UserSignUpRequest,
  UserSignUpRequestDto
}

class UserSignUpRequest {
  readonly email: Email
  readonly name: Name
  readonly surname: Surname
  readonly password: Password

  static create (requestDto: UserSignUpRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        UserSignUpRequest
    > {
    const emailValidationResult = Email.create(requestDto.email)
    const nameValidationResult = Name.create(requestDto.name)
    const surnameValidationResult = Surname.create(requestDto.surname)
    const passwordValidationResult = Password.create(requestDto.password)

    if (
      isLeft(emailValidationResult) ||
      isLeft(nameValidationResult) ||
      isLeft(surnameValidationResult) ||
      isLeft(passwordValidationResult) ||
      !requestDto.areLegalTermsAndConditionsAccepted
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(emailValidationResult, match(error => formValidations.push(new FormValidationError('email', error)), _ => 0))
      pipe(nameValidationResult, match(error => formValidations.push(new FormValidationError('name', error)), _ => 0))
      pipe(surnameValidationResult, match(error => formValidations.push(new FormValidationError('surname', error)), _ => 0))
      pipe(passwordValidationResult, match(error => formValidations.push(new FormValidationError('password', error)), _ => 0))
      if (!requestDto.areLegalTermsAndConditionsAccepted) {
        formValidations.push(new FormValidationError('legalTermsAndConditions', ValidationError.Required))
      }
      return left(formValidations)
    }

    const request = new UserSignUpRequest(
      emailValidationResult.right,
      nameValidationResult.right,
      surnameValidationResult.right,
      passwordValidationResult.right)
    return right(request)
  }

  private constructor (
    email: Email,
    name: Name,
    surname: Surname,
    password: Password
  ) {
    this.email = email
    this.name = name
    this.surname = surname
    this.password = password
  }
}

class UserSignUpRequestDto {
  readonly email: string
  readonly name: string
  readonly surname: string
  readonly password: string
  readonly areLegalTermsAndConditionsAccepted: boolean

  constructor (
    email: string,
    name: string,
    surname: string,
    password: string,
    areLegalTermsAndConditionsAccepted: boolean
  ) {
    this.email = email.trim()
    this.name = name.trim()
    this.surname = surname.trim()
    this.password = password
    this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted
  }
}
