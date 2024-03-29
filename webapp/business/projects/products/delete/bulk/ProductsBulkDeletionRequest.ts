import { Either, left, right, isLeft, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../../../valueObjects/userId'
import { ValidationError } from '../../../../types/validationError'
import FormValidationError from '../../../../types/formValidationError'
import { ProductId } from '../../../../valueObjects/productId'
import { ProjectId } from '../../../../valueObjects/projectId'

export {
  ProductsBulkDeletionRequest,
  ProductsBulkDeletionRequestDto
}

class ProductsBulkDeletionRequest {
  readonly userId: UserId
  readonly projectId: ProjectId
  readonly productsId: ProductId[]

  static create (requestDto: ProductsBulkDeletionRequestDto): Either<
        Array<FormValidationError<ValidationError>>,
        ProductsBulkDeletionRequest
    > {
    const userIdValidationResult = UserId.create(requestDto.userId)
    const projectIdValidationResult = ProjectId.create(requestDto.projectId)
    const productsIdValidationResult = requestDto.productsId.map(id => ProductId.create(id))

    if (
      isLeft(userIdValidationResult) ||
      isLeft(projectIdValidationResult) ||
      productsIdValidationResult.some(x => isLeft(x)) ||
      requestDto.productsId.length === 0
    ) {
      const formValidations: FormValidationError<ValidationError>[] = []
      pipe(userIdValidationResult, match(error => formValidations.push(new FormValidationError('userId', error)), () => 0))
      pipe(projectIdValidationResult, match(error => formValidations.push(new FormValidationError('projectId', error)), () => 0))
      productsIdValidationResult
        .forEach((result, index) => {
          if (!isLeft(result)) return
          pipe(result, match(error => formValidations.push(new FormValidationError(`productsId[${index}]`, error)), () => 0))
        })
      if (requestDto.productsId.length === 0) {
        formValidations.push(new FormValidationError('productsId', ValidationError.Required))
      }
      return left(formValidations)
    }

    const productsId = productsIdValidationResult
      .map(result => {
        if (isLeft(result)) throw new Error('invalid object state')
        return result.right
      })
    const request = new ProductsBulkDeletionRequest(
      userIdValidationResult.right,
      projectIdValidationResult.right,
      productsId
    )
    return right(request)
  }

  private constructor (
    userId: UserId,
    projectId: ProjectId,
    productsId: ProductId[]
  ) {
    this.userId = userId
    this.projectId = projectId
    this.productsId = productsId
  }
}

class ProductsBulkDeletionRequestDto {
  readonly userId: string
  readonly projectId: string
  readonly productsId: string[]

  constructor (
    userId: string,
    projectId: string,
    productsId: string[]
  ) {
    this.userId = userId.trim()
    this.projectId = projectId.trim()
    this.productsId = productsId
      .map(x => x.trim())
      .filter(x => x !== '')
  }
}
