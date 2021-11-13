import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../../valueObjects/userId'
import { ValidationError } from '../../../types/validationError'
import FormValidationError from '../../../types/formValidationError'
import { ProjectId } from '../../../valueObjects/projectId'

export {
  ProjectBulkDeletionRequest,
  ProjectBulkDeletionRequestDto
}

class ProjectBulkDeletionRequest {
  readonly userId: UserId 
  readonly projectsId: ProjectId[]

  static create (requestDto: ProjectBulkDeletionRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        ProjectBulkDeletionRequest
    > {
    const userIdValidationResult = UserId.create(requestDto.userId)
    const projectsIdValidationResult = requestDto.projectsId.map(id => ProjectId.create(id))

    if (
      isLeft(userIdValidationResult) 
      || projectsIdValidationResult.some(x => isLeft(x))
      || projectsIdValidationResult.length === 0
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), _ => 0))
      projectsIdValidationResult
        .forEach((result, index) => {
          if(!isLeft(result)) return
          pipe(result, match(error => formValidations.push(new FormValidationError(`projectsId[${index}]`, error)), _ => 0))
        })
      if (projectsIdValidationResult.length === 0) {
        formValidations.push(new FormValidationError('projectsId', ValidationError.Required))
      }
      return left(formValidations)
    }

    const projectsId = projectsIdValidationResult
      .map(result => {
        if(isLeft(result)) throw new Error('invalid object state')
        return result.right
      })
    const request = new ProjectBulkDeletionRequest(
      userIdValidationResult.right,
      projectsId 
    )
    return right(request)
  }

  private constructor (
    userId: UserId,
    projectsId: ProjectId[],
  ) {
    this.userId = userId 
    this.projectsId = projectsId 
  }
}

class ProjectBulkDeletionRequestDto {
  readonly userId: string
  readonly projectsId: string[]

  constructor (
    userId: string,
    projectsId: string[]
  ) {
    this.userId = userId.trim()
    this.projectsId = projectsId
      .map(x => x.trim())
      .filter(x => x !== '')
  }
}
