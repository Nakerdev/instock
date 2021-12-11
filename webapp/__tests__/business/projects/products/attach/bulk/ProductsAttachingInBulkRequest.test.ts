import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ProjectId } from '../../../../../../business/valueObjects/projectId'
import { ProductId } from '../../../../../../business/valueObjects/productId'
import { UserId } from '../../../../../../business/valueObjects/userId'
import { ValidationError } from '../../../../../../business/types/validationError'
import { ProductsAttachingInBulkRequestDto, ProductsAttachingInBulkRequest } from '../../../../../../business/projects/products/attach/bulk/ProductsAttachingInBulkRequest'

describe('Products Attaching in Bulk Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = ProductsAttachingInBulkRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        request => {
          const expectedUserId = UserId.create(requestDto.userId)
          const expectedProjectId = ProjectId.create(requestDto.projectId)
          const expectedProductsId = requestDto.productsId
            .map(id => ProductId.create(id))
            .map(x => {
              if (isLeft(x)) throw new Error('invalid object state')
              return x.right
            })
          expect(request).toEqual({
            userId: isRight(expectedUserId) ? expectedUserId.right : null,
            projectId: isRight(expectedProjectId) ? expectedProjectId.right : null,
            productsId: expectedProductsId
          })
        }
      )
    )
  })

  const validationErrorTestCases: ValidationErrorTestCase[] = [
    {
      name: 'does not create request when user id has validaiton errors',
      requestDto: buildRequestDto({ userId: '' }),
      expectedFieldId: 'userId'
    },
    {
      name: 'does not create request when project has validation errors',
      requestDto: buildRequestDto({ projectId: '' }),
      expectedFieldId: 'projectId'
    },
    {
      name: 'does not create request when projects id list is empty',
      requestDto: buildRequestDto({ productsId: [] }),
      expectedFieldId: 'productsId',
      expectedError: ValidationError.Required
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = ProductsAttachingInBulkRequest.create(testCase.requestDto)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          errors => {
            expect(errors.length).toBe(1)
            expect(errors[0].fieldId).toBe(testCase.expectedFieldId)
            if (testCase.expectedError) {
              expect(errors[0].error).toBe(testCase.expectedError)
            }
          },
          () => expect(true).toBeFalsy()
        )
      )
    })
  })

  interface requestDtoBuilderParams {
        userId?: string,
        projectId?: string,
        productsId?: string[]
    }

  function buildRequestDto ({
    userId = 'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
    projectId = '5f8e31d2-4a17-11ec-81d3-0242ac130003',
    productsId = ['B08QW794WD']
  }: requestDtoBuilderParams): ProductsAttachingInBulkRequestDto {
    return new ProductsAttachingInBulkRequestDto(
      userId,
      projectId,
      productsId
    )
  }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: ProductsAttachingInBulkRequestDto,
    expectedFieldId: string,
    expectedError?: ValidationError
}
