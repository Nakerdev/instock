import { Either, left, right } from 'fp-ts/Either'
import { isNone } from 'fp-ts/lib/Option'

import ProjectRepository from '../../../projectRepository'
import ProductRepository from '../../productRepository' 
import TimeService from '../../../../infraestructure/timeService'

import { ProductsAttachingInBulkRequest } from './ProductsAttachingInBulkRequest'
import { Product } from '../../product'
import { ProductId } from '../../../../valueObjects/productId'
import { ProjectId } from '../../../../valueObjects/projectId'
import { UserId } from '../../../../valueObjects/userId'

export { AttachProductsToProjectInBulk, ProductsAttachingToProjectError }

enum ProductsAttachingToProjectError {
  ProjectNotExist = 'ProjectNotExist'
}

class AttachProductsToProjectInBulk {
  readonly projectRepository: ProjectRepository
  readonly productRepository: ProductRepository 
  readonly timeService: TimeService

  constructor (
    projectRepository: ProjectRepository,
    productRepository: ProductRepository,
    timeService: TimeService
  ) {
    this.projectRepository = projectRepository
    this.productRepository = productRepository 
    this.timeService = timeService
  }

  async attach (
    request: ProductsAttachingInBulkRequest
  ): Promise<Either<ProductsAttachingToProjectError, Product[]>> {

    const project = await this.projectRepository.searchBy(request.userId, request.projectId)
    if(isNone(project)){
      return left(ProductsAttachingToProjectError.ProjectNotExist)
    }

    const projectProducts = await this.productRepository.searchAll(request.userId, request.projectId)
    const nonExistentProductsId = request.productsId
      .filter((value, index, self) => self.findIndex(id => id.equals(value)) === index)
      .filter(id => !projectProducts.some(existentProduct => existentProduct.id.equals(id)))

    if(nonExistentProductsId.length === 0) return right([])
    const newProducts = this.buildProducts(nonExistentProductsId , request.projectId, request.userId)
    await this.productRepository.saveAll(newProducts)
    return right(newProducts)
  }

  private buildProducts(productsId: ProductId[], projectId: ProjectId, userId: UserId): Product[] {
    const now = this.timeService.utcNow()
    return productsId.map(id => new Product(
      id,
      projectId,
      userId,
      now
    ))
  }
}
