import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../../../utils/apiUtils'
import { DeleteProductsInBulkController } from './controller'
import ServiceFactory from '../../../../factory/serviceFactory'
import ProductPrismaRepository from '../../../../../../infraestructure/projects/products/productRepository'
import { DeleteProductsInBulk } from '../../../../../../business/projects/products/delete/bulk/deleteProductsInBulk'

export function buildDeleteProductsInBulkController (
  res: NextApiResponse,
  req: NextApiRequest
): DeleteProductsInBulkController {
  return new DeleteProductsInBulkController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))

  function buildCommand (): DeleteProductsInBulk {
    return new DeleteProductsInBulk(new ProductPrismaRepository())
  }
}
