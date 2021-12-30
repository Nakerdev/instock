import { Option, match, some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import fetch from "node-fetch";
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client'

import DbProjectModel from '../../../../../prisma/models/projects/project'
import DbProductModel from '../../../../../prisma/models/projects/products/product'
import { ApiResponseBuilder } from '../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../application/session/sessionService'
import { Product } from '../../../../../business/projects/products/product';

export {
  SearchProductsController,
  ProjectDto,
  ProductDto,
  ProjectPrismaRepository,
  RequestDto
}

class RequestDto {
  readonly projectId: string

  constructor(projectId: string) {
    this.projectId = projectId
  }
}

class SearchProductsController {
  readonly productRepository: ProjectRepository
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    productRepository: ProjectRepository,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.productRepository = productRepository
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  search (request: RequestDto): void {
    pipe(
      this.sessionService.currentUser(),
      match(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.searchProject(currentUser, request.projectId)
      )
    )
  }

  private async searchProject (currentUser: UserSession, projectId: string) {
    pipe(
      await this.productRepository.search(currentUser.userId, projectId),
      match(
        () => this.apiResponseBuilder.sendNotFoundResponse(),
        project => this.apiResponseBuilder.sendSuccessResponse(project),
      )
    )
  }
}

interface ProjectRepository {
  search (userId: string, projectId: string): Promise<Option<ProjectDto>>
}

class ProjectPrismaRepository implements ProjectRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async search (userId: string, projectId: string): Promise<Option<ProjectDto>> {
    try {
      await this.prisma.$connect()
      const dbModel: DbProjectModel | null = await this.prisma.projects.findFirst({
        where: {
          id: projectId,
          userId: userId
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
    return new ProductDto(dbEntity.id, "", "", "", true)
  }
}

class ProductPrismaRepository {

  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async searchProductsId (projectId: string): Promise<string[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProductModel[] = await this.prisma.products.findMany({
        where: {
          projectId: projectId
        }
      })
      const productsid = dbModels.map(model => model.id)
      return productsid 
    } finally {
      this.prisma.$disconnect()
    }
  }
}

class ProductDetailsWebScrappingRepository {

  async searchProductsDetails(productsId: string[]): Promise<ProductDto[]> {
    const products: ProductDto[] = [];
    productsId.forEach(async asin => {
      const product = await this.searchProductsDetailsFromAmazonWebPage(asin)
      products.push(product);
    });
    return products;
  }

  private searchProductsDetailsFromAmazonWebPage(asin: string) : Promise<ProductDto> {
    const searchAmazonProductByAsinUrl = `https://www.amazon.es/exec/obidos/ASIN/${asin}`;
    return fetch(searchAmazonProductByAsinUrl)
    .then(response =>response.text())
    .then(html => {
      const $ = cheerio.load(html);
      const availabilityDomElement: cheerio.Cheerio = $('#availability > span[class*="a-color-success"]');
      const title: string = $('#productTitle').text();
      const price: string = $('#corePrice_feature_div > div > span').first().text();
      const image: string | undefined = $('#landingImage').attr('src');
      return new ProductDto(
        asin,
        title,
        price,
        image,
        availabilityDomElement.length === 1
      )
    })
    .catch(e => new ProductDto(asin, "", "", "", true));
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
  readonly name: string
  readonly price: string
  readonly prictureUrl: string | undefined
  readonly isInStock: boolean

  constructor (
    id: string,
    name: string,
    price: string,
    pictureUrl: string | undefined,
    isInStock: boolean
  ) {
    this.id = id
    this.name = name
    this.price = price
    this.prictureUrl = pictureUrl
    this.isInStock = isInStock 
  }
}
