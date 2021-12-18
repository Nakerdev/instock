import { match } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import DbProjectModel from '../../../../prisma/models/projects/project'
import DbProductModel from '../../../../prisma/models/projects/products/product'
import { ApiResponseBuilder } from './../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../application/session/sessionService'
import { PrismaClient } from '@prisma/client'
import { Product } from '../../../../business/projects/products/product'

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
      match(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.searchProjects(currentUser)
      )
    )
  }

  private async searchProjects (currentUser: UserSession) {
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

  async searchAll (userId: string): Promise<ProjectDto[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProjectModel[] = await this.prisma.projects.findMany({
        where: {
          userId: userId
        }
      })
      const projectsId = dbModels.map(model => model.id)
      const projectsProducts = await this.searchProjectsProducts(projectsId)
      const projects = dbModels.map(model => this.buildProject(model, projectsProducts))
      return projects
    } finally {
      this.prisma.$disconnect()
    }
  }

  async searchProjectsProducts (projectsId: string[]): Promise<ProductDto[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProductModel[] = await this.prisma.products.findMany({
        where: {
          projectId: { in: projectsId } 
        }
      })
      const products = dbModels.map(model => this.buildProduct(model))
      return products
    } finally {
      this.prisma.$disconnect()
    }
  }

  private buildProject (dbEntity: DbProjectModel, products: ProductDto[]): ProjectDto {
    return new ProjectDto(
      dbEntity.id, 
      dbEntity.name,
      products.filter(product => product.projectId === dbEntity.id).length,
      dbEntity.created_at)
  }

  private buildProduct (dbEntity: DbProductModel): ProductDto {
    return new ProductDto(
      dbEntity.id, 
      dbEntity.projectId)
  }
}

class ProjectDto {
  readonly id: string
  readonly name: string
  readonly totalNumberOfProducts: number
  readonly created_at: Date

  constructor (
    id: string, 
    name: string,
    totalNumberOfProducts: number,
    created_at: Date) {
    this.id = id
    this.name = name
    this.totalNumberOfProducts = totalNumberOfProducts
    this.created_at = created_at
  }
}

class ProductDto {
  readonly id: string
  readonly projectId: string

  constructor (
    id: string, 
    projectId: string) {
    this.id = id
    this.projectId = projectId 
  }
}
