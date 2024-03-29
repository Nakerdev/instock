import { Option, match, some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import axios from 'axios';
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client'

import DbProjectModel from '../../../../../prisma/models/projects/project'
import DbProductModel from '../../../../../prisma/models/projects/products/product'
import { ApiResponseBuilder } from '../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../application/session/sessionService'

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
  readonly productRepository: ProductFacadeRepository;

  constructor () {
    this.prisma = new PrismaClient()
    this.productRepository = new ProductFacadeRepository(
      new ProductPrismaRepository(),
      new ProductDetailsWebScrappingRepository()
    )
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
      const products = await this.productRepository.searchProducts(projectId)
      return some(this.buildProject(dbModel, products))
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
}

class ProductFacadeRepository {

  readonly productRepository: ProductPrismaRepository;
  readonly productDetailsRepository: ProductDetailsWebScrappingRepository;

  constructor(
    productRepository: ProductPrismaRepository,
    productDetailsRepository: ProductDetailsWebScrappingRepository
  ){
    this.productRepository = productRepository;
    this.productDetailsRepository = productDetailsRepository;
  }

  async searchProducts(projectId: string): Promise<ProductDto[]>{
    const productsId = await this.productRepository.searchProductsId(projectId);
    const productsDetails = await this.productDetailsRepository.searchProductsDetails(productsId);
    return productsDetails;
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
    return Promise.all(productsId.map(async asin => {
      return this.searchProductsDetailsFromAmazonWebPage(asin)
    }));
  }

  private searchProductsDetailsFromAmazonWebPage(asin: string) : Promise<ProductDto> {
    const searchAmazonProductByAsinUrl = `https://www.amazon.es/exec/obidos/ASIN/${asin}`;
    return axios.get(searchAmazonProductByAsinUrl)
    .then(response => {
      const $ = cheerio.load(response.data);
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
