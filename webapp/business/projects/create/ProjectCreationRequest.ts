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
  readonly createEvenIfAnotherProjectAlreadyExistsWithTheSameName: boolean

  static create (requestDto: ProjectCreationRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        ProjectCreationRequest
    > {
    const userIdValidationResult = UserId.create(requestDto.userId)
    const nameValidationResult = Name.create(requestDto.name)

    if (
      isLeft(userIdValidationResult) 
      || isLeft(nameValidationResult)
      || !requestDto.createEvenIfAnotherProjectAlreadyExistsWithTheSameName
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), _ => 0))
      pipe(nameValidationResult, match(error => formValidations.push(new FormValidationError('name', error)), _ => 0))
      if (!requestDto.createEvenIfAnotherProjectAlreadyExistsWithTheSameName) {
        formValidations.push(new FormValidationError('createEvenIfAnotherProjectAlreadyExistsWithTheSameName', ValidationError.Required))
      }
      return left(formValidations)
    }

    const boolValue: boolean = (/true/i).test(requestDto.createEvenIfAnotherProjectAlreadyExistsWithTheSameName)
    const request = new ProjectCreationRequest(
      userIdValidationResult.right,
      nameValidationResult.right,
      boolValue)
    return right(request)
  }

  private constructor (
    userId: UserId,
    name: Name,
    createEvenIfAnotherProjectAlreadyExistsWithTheSameName: boolean
  ) {
    this.userId = userId 
    this.name = name
    this.createEvenIfAnotherProjectAlreadyExistsWithTheSameName = createEvenIfAnotherProjectAlreadyExistsWithTheSameName 
  }
}

class ProjectCreationRequestDto {
  readonly userId: string
  readonly name: string
  readonly createEvenIfAnotherProjectAlreadyExistsWithTheSameName: string

  constructor (
    userId: string,
    name: string,
    createEvenIfAnotherProjectAlreadyExistsWithTheSameName: string
  ) {
    this.userId = userId.trim()
    this.name = name.trim()
    this.createEvenIfAnotherProjectAlreadyExistsWithTheSameName = createEvenIfAnotherProjectAlreadyExistsWithTheSameName.trim()
  }
}
