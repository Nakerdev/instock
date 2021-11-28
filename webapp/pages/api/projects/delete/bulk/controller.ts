import { match } from 'fp-ts/Either'
import { match as matchOption } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../../utils/apiUtils'
import { DeleteProjectsInBulk } from '../../../../../business/projects/delete/bulk/deleteProjectsInBulk'
import { ProjectBulkDeletionRequest, ProjectBulkDeletionRequestDto } from '../../../../../business/projects/delete/bulk/ProjectBulkDeletionRequest'
import SessionService, { UserSession } from '../../../../../application/session/sessionService'

export {
  DeleteProjectsInBulkController,
  DeleteProjectsInBulkControllerRequest
}

class DeleteProjectsInBulkController {
  readonly command: DeleteProjectsInBulk
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: DeleteProjectsInBulk,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  delete (request: DeleteProjectsInBulkControllerRequest): void {
    pipe(
      this.sessionService.currentUser(),
      matchOption(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.buildCommandRequest(request, currentUser)
      )
    )
  }

  private buildCommandRequest (controllerRequest: DeleteProjectsInBulkControllerRequest, currentUser: UserSession) {
    const commandRequestDto = new ProjectBulkDeletionRequestDto(
      currentUser.userId,
      controllerRequest.projectsId
    )
    pipe(
      ProjectBulkDeletionRequest.create(commandRequestDto),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: ProjectBulkDeletionRequest): Promise<void> {
    await this.command.delete(request)
    return this.apiResponseBuilder.sendSuccessResponse({})
  }
}

class DeleteProjectsInBulkControllerRequest {
  readonly projectsId: string[]

  constructor (
    projectsId: string[]
  ) {
    this.projectsId = projectsId
  }
}
