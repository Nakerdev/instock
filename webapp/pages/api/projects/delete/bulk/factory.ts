import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../../utils/apiUtils'
import { DeleteProjectsInBulkController } from './controller'
import ProjectPrismaRepository from '../../../../../infraestructure/projects/projectRepository'
import { DeleteProjectsInBulk } from '../../../../../business/projects/delete/bulk/deleteProjectsInBulk'
import ServiceFactory from '../../../factory/serviceFactory'
import ProductPrismaRepository from '../../../../../infraestructure/projects/products/productRepository'

export function buildDeleteProjectsInBulkController (
  res: NextApiResponse,
  req: NextApiRequest
): DeleteProjectsInBulkController {
  return new DeleteProjectsInBulkController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))

  function buildCommand (): DeleteProjectsInBulk {
    return new DeleteProjectsInBulk(
      new ProjectPrismaRepository(),
      new ProductPrismaRepository()
    )
  }
}
