import { Option, match, some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import DbProjectModel from '../../../../../prisma/models/projects/project'
import DbProductModel from '../../../../../prisma/models/projects/products/product'
import { ApiResponseBuilder } from './../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../application/session/sessionService'
import { PrismaClient } from '@prisma/client'

export {
  SearchProductsController,
  ProjectDto,
  ProductPrismaRepository
}

class SearchProductsController {
  readonly productRepository: ProductRepository
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    productRepository: ProductRepository,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.productRepository = productRepository
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  search (): void {
    pipe(
      this.sessionService.currentUser(),
      match(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.searchProject(currentUser)
      )
    )
  }

  private async searchProject (currentUser: UserSession) {
    const project = await this.productRepository.search(currentUser.userId)
    this.apiResponseBuilder.sendSuccessResponse(project)
  }
}

interface ProductRepository {
  search (projectId: string): Promise<Option<ProjectDto>>
}

class ProductPrismaRepository implements ProductRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async search (projectId: string): Promise<Option<ProjectDto>> {
    try {
      await this.prisma.$connect()
      const dbModel: DbProjectModel | null = await this.prisma.projects.findFirst({
        where: {
          id: projectId
        }
      })
      if(dbModel === null) return none
      const products = await this.searchProducts(projectId)
      return some(this.buildProject(dbModel, products))
    } finally {
      this.prisma.$disconnect()
    }
  }

  async searchProducts (projectId: string): Promise<ProductDto[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProductModel[] = await this.prisma.products.findMany({
        where: {
          projectId: projectId
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
      dbEntity.name,
      products
    )
  }

  private buildProduct (dbEntity: DbProductModel): ProductDto {
    return new ProductDto(dbEntity.id)
  }
}

class ProjectDto {
  readonly name: string
  readonly products: ProductDto[]

  constructor (
    name: string, 
    products: ProductDto[]) {
    this.name = name
    this.products = products
  }
}

class ProductDto {
  readonly id: string

  constructor (id: string) {
    this.id = id
  }
}
