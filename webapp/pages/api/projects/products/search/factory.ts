import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../../utils/apiUtils'
import { SearchProductsController, ProductPrismaRepository } from './controller'
import ServiceFactory from '../../../factory/serviceFactory'

export function buildSearchProductsController (
  res: NextApiResponse,
  req: NextApiRequest
): SearchProductsController {
  return new SearchProductsController(
    new ProductPrismaRepository(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))
}
