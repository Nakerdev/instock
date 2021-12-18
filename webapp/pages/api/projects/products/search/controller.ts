import { match } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import DbProjectModel from '../../../../../prisma/models/projects/project'
import DbProductModel from '../../../../../prisma/models/projects/products/product'
import { ApiResponseBuilder } from './../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../application/session/sessionService'
import { PrismaClient } from '@prisma/client'
import { Product } from '../../../../../business/projects/products/product'

export {
  SearchProductsController,
  ProjectDto,
  ProjectPrismaRepository
}

class SearchProductsController {
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

interface ProductRepository {
  search(projectId: string): Promise<ProjectDto[]>
}

class ProductPrismaRepository implements ProductRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async search (projectId: string): Promise<ProjectDto> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProjectModel | null = await this.prisma.projects.findFirst({
        where: {
          id: projectId
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
  readonly name: string
  readonly products: ProductDto[]

  constructor (
    id: string, 
    products: ProductDto[]) {
    this.name = name
    this.products = products
  }
}

class ProductDto {
  readonly id: string
  readonly name: string

  constructor (
    id: string, 
    name: string) {
    this.id = id
    this.name = name 
  }
}
