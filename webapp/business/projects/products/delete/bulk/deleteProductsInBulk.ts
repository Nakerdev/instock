import ProductRepository from '../../productRepository'

import { ProductsBulkDeletionRequest } from './ProductsBulkDeletionRequest'

export class DeleteProductsInBulk {
  readonly productsRepository: ProductRepository

  constructor (
    productsRepository: ProductRepository,
  ) {
    this.productsRepository = productsRepository
  }

  async delete (
    request: ProductsBulkDeletionRequest
  ): Promise<void> {
    await this.productsRepository.deleteAll(request.userId, request.projectId, request.productsId)
  }
}
