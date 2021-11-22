import { mock, MockProxy } from 'jest-mock-extended'
import { isRight, match, isLeft } from 'fp-ts/Either'
import { some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../../../../../../business/projects/projectRepository'
import ProductRepository from '../../../../../../business/projects/products/productRepository'
import TimeService from '../../../../../../business/infraestructure/timeService'
import { AttachProductsToProjectInBulk, ProductsAttachingToProjectError } from '../../../../../../business/projects/products/create/bulk/attachProductsToProjectInBulk'
import { ProductsCreationInBulkRequest, ProductsCreationInBulkRequestDto } from '../../../../../../business/projects/products/create/bulk/ProductsCreationInBulkRequest'
import buildProject from '../../../../builders/projects/projectBuilder'
import buildProduct from '../../../../builders/projects/products/productBuilder'

describe('Attach products to project in bluk', () => {
  let projectRepository: MockProxy<ProjectRepository>
  let productRepository: MockProxy<ProductRepository>
  let timeService: MockProxy<TimeService>
  let command: AttachProductsToProjectInBulk

  beforeEach(() => {
    projectRepository = mock<ProjectRepository>()
    productRepository = mock<ProductRepository>()
    timeService = mock<TimeService>()
    command = new AttachProductsToProjectInBulk(
      projectRepository,
      productRepository,
      timeService
    )
  })

  it('attaches products to project', async () => {
    const request = <ProductsCreationInBulkRequest>buildRequest({})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(some(buildProject({})))
    productRepository.searchAll
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue([])
    const utcNow = new Date(2021, 10, 10)
    timeService.utcNow
      .mockReturnValue(utcNow)

    const result = await command.attach(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        createdProducts => {
          expect(createdProducts.length).toBe(1)
          expect(createdProducts[0].id).toBe(request.productsId[0])
        }
      )
    )
    expect(productRepository.saveAll).toHaveBeenCalledWith([
      expect.objectContaining({
        id: request.productsId[0],
        projectId: request.projectId,
        userId: request.userId,
        created_at: utcNow
      })
    ])
  })

  it('does not duplicate products if already exist one with the same id', async () => {
    const request = <ProductsCreationInBulkRequest>buildRequest({})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(some(buildProject({})))
    productRepository.searchAll
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue([buildProduct({id: request.productsId[0].state.value})])

    const result = await command.attach(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        createdProducts => {
          expect(createdProducts.length).toBe(0)
        }
      )
    )
    expect(productRepository.saveAll).not.toHaveBeenCalled()
  })

  it('does not duplicate products if user set the same id twice', async () => {
    const request = <ProductsCreationInBulkRequest>buildRequest({productsId: ['B08QW794WD', 'B08QW794WD']})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(some(buildProject({})))
    productRepository.searchAll
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue([])

    const result = await command.attach(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        createdProducts => {
          expect(createdProducts.length).toBe(1)
          expect(createdProducts[0].id).toBe(request.productsId[0])
        }
      )
    )
    expect(productRepository.saveAll).toHaveBeenCalled()
  })

  it('does not attach products if project not exist', async () => {
    const request = <ProductsCreationInBulkRequest>buildRequest({})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(none)

    const result = await command.attach(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(ProductsAttachingToProjectError.ProjectNotExist),
        _ => expect(true).toBeFalsy()
      )
    )
    expect(productRepository.saveAll).not.toHaveBeenCalled()
  })
    
  interface RequestBuilderParams {
    productsId?: string[];
  }

  function buildRequest ({
    productsId = ['B08QW794WD']
  }: RequestBuilderParams): ProductsCreationInBulkRequest | null {
    const requestDto = new ProductsCreationInBulkRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      '5f8e31d2-4a17-11ec-81d3-0242ac130003',
      productsId
    )
    return pipe(
      ProductsCreationInBulkRequest.create(requestDto),
      match(
        _ => null,
        request => request
      )
    )
  }
})
