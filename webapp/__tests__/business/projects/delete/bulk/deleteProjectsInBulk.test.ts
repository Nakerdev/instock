import { mock, MockProxy } from 'jest-mock-extended'
import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../../../../../business/projects/projectRepository'

import { DeleteProjectsInBulk } from '../../../../../business/projects/delete/bulk/deleteProjectsInBulk'
import { ProjectBulkDeletionRequest, ProjectBulkDeletionRequestDto } from '../../../../../business/projects/delete/bulk/ProjectBulkDeletionRequest'
import ProductRepository from '../../../../../business/projects/products/productRepository'

describe('Crete Project', () => {
  let projectRepository: MockProxy<ProjectRepository>
  let productRepository: MockProxy<ProductRepository>
  let command: DeleteProjectsInBulk

  beforeEach(() => {
    projectRepository = mock<ProjectRepository>()
    productRepository = mock<ProductRepository>()
    command = new DeleteProjectsInBulk(
      projectRepository,
      productRepository
    )
  })

  it('deletes project', async () => {
    const request = <ProjectBulkDeletionRequest>buildRequest()

    await command.delete(request)

    expect(productRepository.deleteAllProjectsProducts).toHaveBeenCalledWith(
      request.userId,
      request.projectsId
    )
    expect(projectRepository.deleteAll).toHaveBeenCalledWith(
      request.userId,
      request.projectsId
    )
  })

  function buildRequest (): ProjectBulkDeletionRequest | null {
    const requestDto = new ProjectBulkDeletionRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      ['4b149208-44bf-11ec-81d3-0242ac130003']
    )
    return pipe(
      ProjectBulkDeletionRequest.create(requestDto),
      match(
        () => null,
        request => request
      )
    )
  }
})
