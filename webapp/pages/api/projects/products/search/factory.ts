import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../../utils/apiUtils'
import { SearchProductsController, ProjectPrismaRepository } from './controller'
import ServiceFactory from '../../../factory/serviceFactory'

export function buildSearchProductsController (
  res: NextApiResponse,
  req: NextApiRequest
): SearchProductsController {
  return new SearchProductsController(
    new ProjectPrismaRepository(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))
}
