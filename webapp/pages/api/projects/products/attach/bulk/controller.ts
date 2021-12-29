import { match } from 'fp-ts/Either'
import { match as matchOption } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../../../utils/apiUtils'
import SessionService, { UserSession } from '../../../../../../application/session/sessionService'
import { AttachProductsToProjectInBulk } from '../../../../../../business/projects/products/attach/bulk/attachProductsToProjectInBulk'
import { ProductsAttachingInBulkRequest, ProductsAttachingInBulkRequestDto } from '../../../../../../business/projects/products/attach/bulk/ProductsAttachingInBulkRequest'

export {
  AttachProductsInBulkController,
  AttachProductsInBulkControllerRequest
}

class AttachProductsInBulkController {
  readonly command: AttachProductsToProjectInBulk
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: AttachProductsToProjectInBulk,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  attach (request: AttachProductsInBulkControllerRequest): void {
    pipe(
      this.sessionService.currentUser(),
      matchOption(
        () => this.apiResponseBuilder.sendUnauthorizedResponse(),
        currentUser => this.buildCommandRequest(request, currentUser)
      )
    )
  }

  private buildCommandRequest (controllerRequest: AttachProductsInBulkControllerRequest, currentUser: UserSession) {
    throw new Error("mi culo");
    const commandRequestDto = new ProductsAttachingInBulkRequestDto(
      currentUser.userId,
      controllerRequest.projectId,
      controllerRequest.productsId
    )
    pipe(
      ProductsAttachingInBulkRequest.create(commandRequestDto),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: ProductsAttachingInBulkRequest): Promise<void> {
    pipe(
      await this.command.attach(request),
      match(
        error => this.apiResponseBuilder.sendCommandErrorResponse(error.toString()),
        () => this.apiResponseBuilder.sendSuccessResponse({})
      )
    )
  }
}

class AttachProductsInBulkControllerRequest {
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
