import { Either, left, right } from 'fp-ts/Either'
import { isNone } from 'fp-ts/Option'

import ProjectRepository from '../projectRepository'
import UserRepository from '../../users/userRepository'
import UuidService from '../../security/cryptography/uuidService'
import TimeService from '../../infraestructure/timeService'

import { Project } from '../project'
import { ProjectCreationRequest } from './ProjectCreationRequest'
import { ProjectId } from '../../valueObjects/projectId'

export { CreateProject, ProjectCreationError }

enum ProjectCreationError {
  UserNotExist = 'UserNotExist',
  ProjectWithTheSameNameAlreadyExist = 'ProjectWithTheSameNameAlreadyExist'
}

class CreateProject {
  readonly projectRepository: ProjectRepository
  readonly userRepository: UserRepository
  readonly uuidService: UuidService
  readonly timeService: TimeService

  constructor (
    projectRepository: ProjectRepository,
    userRepository: UserRepository,
    uuidService: UuidService,
    timeService: TimeService
  ) {
    this.projectRepository = projectRepository
    this.userRepository = userRepository
    this.uuidService = uuidService
    this.timeService = timeService
  }

  async create (
    request: ProjectCreationRequest
  ): Promise<Either<ProjectCreationError, Project>> {

    const user = await this.userRepository.searchById(request.userId)
    if (isNone(user)) {
      return left(ProjectCreationError.UserNotExist)
    }

    const isThereAlreadyProjectWithTheSameName = await this.projectRepository.exist(request.userId, request.name)
    if(isThereAlreadyProjectWithTheSameName){
      return left(ProjectCreationError.ProjectWithTheSameNameAlreadyExist)
    }
    
    const project = await this.buildProject(request)
    await this.projectRepository.save(project)
    return right(project)
  }

  private async buildProject (request: ProjectCreationRequest): Promise<Project> {
    const id = ProjectId.newId(this.uuidService)
    const created_at = this.timeService.utcNow()
    return new Project(
      id,
      request.userId,
      request.name,
      created_at
    )
  }
}
