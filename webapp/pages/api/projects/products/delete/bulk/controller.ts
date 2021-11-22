import { match } from 'fp-ts/Either'
import { match as matchOption } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from '../../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../../application/session/sessionService'
import { DeleteProductsInBulk } from '../../../../../../business/projects/products/delete/bulk/deleteProductsInBulk'
import { ProductsBulkDeletionRequestDto, ProductsBulkDeletionRequest } from '../../../../../../business/projects/products/delete/bulk/ProductsBulkDeletionRequest'

export {
  DeleteProductsInBulkController,
  DeleteProductsInBulkControllerRequest
}

class DeleteProductsInBulkController {
  readonly command: DeleteProductsInBulk
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: DeleteProductsInBulk,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  delete (request: DeleteProductsInBulkControllerRequest): void {
    pipe(
      this.sessionService.currentUser(),
      matchOption (
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.buildCommandRequest(request, currentUser)
      )
    )
  }

  private buildCommandRequest (controllerRequest: DeleteProductsInBulkControllerRequest, currentUser: UserSession) {
    const commandRequestDto = new ProductsBulkDeletionRequestDto(
      currentUser.userId,
      controllerRequest.projectId,
      controllerRequest.productsId,
    )
    pipe(
      ProductsBulkDeletionRequest.create(commandRequestDto),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: ProductsBulkDeletionRequest): Promise<void> {
    await this.command.delete(request),
    this.apiResponseBuilder.sendSuccessResponse({})
  }
}

class DeleteProductsInBulkControllerRequest {
  readonly projectId: string
  readonly productsId: string[]

  constructor (
    projectId: string,
    productsId: string[]
  ) {
    this.projectId = projectId
    this.productsId = productsId 
  }
}