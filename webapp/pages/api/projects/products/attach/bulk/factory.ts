import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../../../utils/apiUtils'
import { AttachProductsInBulkController } from './controller'
import ProjectPrismaRepository from '../../../../../../infraestructure/projects/projectRepository'
import ServiceFactory from '../../../../factory/serviceFactory'
import { AttachProductsToProjectInBulk } from '../../../../../../business/projects/products/attach/bulk/attachProductsToProjectInBulk'
import SystemTimeService from '../../../../../../infraestructure/systemTimeService'
import ProductPrismaRepository from '../../../../../../infraestructure/projects/products/productRepository'

export function buildAttachProductsInBulkController (
  res: NextApiResponse,
  req: NextApiRequest
): AttachProductsInBulkController {
  return new AttachProductsInBulkController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))

  function buildCommand (): AttachProductsToProjectInBulk {
    return new AttachProductsToProjectInBulk(
      new ProjectPrismaRepository(),
      new ProductPrismaRepository(),
      new SystemTimeService())
  }
}
