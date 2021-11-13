import { match } from 'fp-ts/Either'
import { match as matchOption } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../utils/apiUtils'
import { CreateProject } from '../../../../business/projects/create/createProject'
import SessionService, { UserSession } from '../../../../application/session/sessionService'
import { ProjectCreationRequestDto, ProjectCreationRequest } from '../../../../business/projects/create/ProjectCreationRequest'

export {
  CreateProjectController,
  ProjectCreationControllerRequest
}

class CreateProjectController {
  readonly command: CreateProject
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: CreateProject,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  create (request: ProjectCreationControllerRequest): void {
    pipe(
      this.sessionService.currentUser(),
      matchOption (
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.buildCommandRequest(request, currentUser)
      )
    )
  }

  private buildCommandRequest (controllerRequest: ProjectCreationControllerRequest, currentUser: UserSession) {
    const commandRequestDto = new ProjectCreationRequestDto(
      currentUser.userId,
      controllerRequest.name,
      controllerRequest.createEvenIfAnotherProjectAlreadyExistsWithTheSameName
    )
    pipe(
      ProjectCreationRequest.create(commandRequestDto),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: ProjectCreationRequest): Promise<void> {
    pipe(
      await this.command.create(request),
      match(
        error => this.apiResponseBuilder.sendCommandErrorResponse(error.toString()),
        _ => this.apiResponseBuilder.sendSuccessResponse({})
      )
    )
  }
}

class ProjectCreationControllerRequest {
  readonly name: string
  readonly createEvenIfAnotherProjectAlreadyExistsWithTheSameName: string

  constructor (
    name: string,
    createEvenIfAnotherProjectAlreadyExistsWithTheSameName: string
  ) {
    this.name = name
    this.createEvenIfAnotherProjectAlreadyExistsWithTheSameName = createEvenIfAnotherProjectAlreadyExistsWithTheSameName 
  }
}