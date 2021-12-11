import ProjectRepository from '../../projectRepository'

import { ProjectBulkDeletionRequest } from './ProjectBulkDeletionRequest'
import ProductRepository from '../../products/productRepository'

export class DeleteProjectsInBulk {
  readonly projectRepository: ProjectRepository
  readonly productRepository: ProductRepository

  constructor (
    projectRepository: ProjectRepository,
    productRepository: ProductRepository
  ) {
    this.projectRepository = projectRepository
    this.productRepository = productRepository
  }

  async delete (
    request: ProjectBulkDeletionRequest
  ): Promise<void> {
    await this.productRepository.deleteAllProjectsProducts(request.userId, request.projectsId)
    await this.projectRepository.deleteAll(request.userId, request.projectsId)
  }
}
