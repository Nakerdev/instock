import { match } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import DbProjectModel from '../../../../prisma/models/projects/project'
import { ApiResponseBuilder } from './../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../application/session/sessionService'
import { PrismaClient } from '@prisma/client'

export {
  SearchAllProjectsController,
  ProjectDto,
  ProjectPrismaRepository
}

class SearchAllProjectsController {
  readonly projectRepository: ProjectRepository
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    projectRepository: ProjectRepository,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.projectRepository = projectRepository
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  search (): void {
    pipe(
      this.sessionService.currentUser(),
      match (
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.searchProjects(currentUser)
      )
    )
  }

  private async searchProjects(currentUser: UserSession){
    const projects = await this.projectRepository.searchAll(currentUser.userId) 
    this.apiResponseBuilder.sendSuccessResponse(projects)
  }
}

interface ProjectRepository {
  searchAll(userId: string): Promise<ProjectDto[]>
}

class ProjectPrismaRepository implements ProjectRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }


  async searchAll(userId: string): Promise<ProjectDto[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProjectModel[] = await this.prisma.projects.findMany({
        where: {
          userId: userId
        }
      })
      const projects = dbModels.map(model => this.buildProject(model))
      return projects
    } finally {
      this.prisma.$disconnect()
    }
  }

  private buildProject(dbEntity: DbProjectModel): ProjectDto {
    return new ProjectDto(dbEntity.id, dbEntity.name)
  }

}

class ProjectDto {
  readonly id: string
  readonly name: string

  constructor(id: string, name: string){
    this.id = id
    this.name = name
  }
}