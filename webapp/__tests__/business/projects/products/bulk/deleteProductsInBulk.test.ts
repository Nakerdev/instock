import { mock, MockProxy } from 'jest-mock-extended'
import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { DeleteProductsInBulk } from '../../../../../business/projects/products/delete/bulk/deleteProductsInBulk'
import ProductRepository from '../../../../../business/projects/products/productRepository'
import { ProductsBulkDeletionRequest, ProductsBulkDeletionRequestDto } from '../../../../../business/projects/products/delete/bulk/ProductsBulkDeletionRequest'

describe('Delete Products In Bulk', () => {
  let productRepository: MockProxy<ProductRepository>
  let command: DeleteProductsInBulk

  beforeEach(() => {
    productRepository = mock<ProductRepository>()
    command = new DeleteProductsInBulk(
      productRepository
    )
  })

  it('deletes products', async () => {
    const request = <ProductsBulkDeletionRequest>buildRequest()

    await command.delete(request)

    expect(productRepository.deleteAll).toHaveBeenCalledWith(
      request.userId,
      request.projectId,
      request.productsId
    )
  })

  function buildRequest (): ProductsBulkDeletionRequest | null {
    const requestDto = new ProductsBulkDeletionRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      '4b149208-44bf-11ec-81d3-0242ac130003',
      ['B08QW794WD']
    )
    return pipe(
      ProductsBulkDeletionRequest.create(requestDto),
      match(
        _ => null,
        request => request
      )
    )
  }
})
