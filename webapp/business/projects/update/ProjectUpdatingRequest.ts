import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../valueObjects/userId'
import { Name } from '../../valueObjects/name'
import { ValidationError } from '../../types/validationError'
import FormValidationError from '../../types/formValidationError'
import { ProjectId } from '../../valueObjects/projectId'

export {
  ProjectUpdatingRequest,
  ProjectUpdatingRequestDto
}

class ProjectUpdatingRequest {
  readonly projectId: ProjectId
  readonly userId: UserId
  readonly name: Name

  static create (requestDto: ProjectUpdatingRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        ProjectUpdatingRequest
    > {
    const projectIdValidationResult = ProjectId.create(requestDto.projectId)
    const userIdValidationResult = UserId.create(requestDto.userId)
    const nameValidationResult = Name.create(requestDto.name)

    if (
      isLeft(projectIdValidationResult) ||
      isLeft(userIdValidationResult) ||
      isLeft(nameValidationResult)
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(projectIdValidationResult, match(error => formValidations.push(new FormValidationError('projectId', error)), () => 0))
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), () => 0))
      pipe(nameValidationResult, match(error => formValidations.push(new FormValidationError('name', error)), () => 0))
      return left(formValidations)
    }

    const request = new ProjectUpdatingRequest(
      projectIdValidationResult.right,
      userIdValidationResult.right,
      nameValidationResult.right)
    return right(request)
  }

  private constructor (
    projectId: ProjectId,
    userId: UserId,
    name: Name
  ) {
    this.projectId = projectId
    this.userId = userId
    this.name = name
  }
}

class ProjectUpdatingRequestDto {
  readonly projectId: string
  readonly userId: string
  readonly name: string

  constructor (
    projectId: string,
    userId: string,
    name: string
  ) {
    this.projectId = projectId.trim()
    this.userId = userId.trim()
    this.name = name.trim()
  }
}
