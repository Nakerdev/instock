import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../valueObjects/userId'
import { Name } from '../../valueObjects/name'
import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'

export {
  ProjectCreationRequest,
  ProjectCreationRequestDto
}

class ProjectCreationRequest {
  readonly userId: UserId
  readonly name: Name

  static create (requestDto: ProjectCreationRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        ProjectCreationRequest
    > {
    const userIdValidationResult = UserId.create(requestDto.userId)
    const nameValidationResult = Name.create(requestDto.name)

    if (isLeft(userIdValidationResult) || isLeft(nameValidationResult)
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), () => 0))
      pipe(nameValidationResult, match(error => formValidations.push(new FormValidationError('name', error)), () => 0))
      return left(formValidations)
    }

    const request = new ProjectCreationRequest(
      userIdValidationResult.right,
      nameValidationResult.right)
    return right(request)
  }

  private constructor (
    userId: UserId,
    name: Name
  ) {
    this.userId = userId
    this.name = name
  }
}

class ProjectCreationRequestDto {
  readonly userId: string
  readonly name: string

  constructor (
    userId: string,
    name: string
  ) {
    this.userId = userId.trim()
    this.name = name.trim()
  }
}
