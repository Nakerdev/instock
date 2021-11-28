import { match } from 'fp-ts/Either'
import { match as matchOption } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from '../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../application/session/sessionService'
import { UpdateProject } from '../../../../business/projects/update/updateProject'
import { ProjectUpdatingRequestDto, ProjectUpdatingRequest } from '../../../../business/projects/update/ProjectUpdatingRequest'

export {
  UpdateProjectController,
  ProjectUpdatingControllerRequest
}

class UpdateProjectController {
  readonly command: UpdateProject
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: UpdateProject,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  update (request: ProjectUpdatingControllerRequest): void {
    pipe(
      this.sessionService.currentUser(),
      matchOption(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.buildCommandRequest(request, currentUser)
      )
    )
  }

  private buildCommandRequest (controllerRequest: ProjectUpdatingControllerRequest, currentUser: UserSession) {
    const commandRequestDto = new ProjectUpdatingRequestDto(
      controllerRequest.projectId,
      currentUser.userId,
      controllerRequest.name
    )
    pipe(
      ProjectUpdatingRequest.create(commandRequestDto),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: ProjectUpdatingRequest): Promise<void> {
    await this.command.update(request)
    this.apiResponseBuilder.sendSuccessResponse({})
  }
}

class ProjectUpdatingControllerRequest {
  readonly projectId: string
  readonly name: string

  constructor (
    projectId: string,
    name: string
  ) {
    this.projectId = projectId
    this.name = name
  }
}
