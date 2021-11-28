import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { SearchAllProjectsController, ProjectPrismaRepository } from './controller'
import ServiceFactory from '../../factory/serviceFactory'

export function buildSearchAllProjectsController (
  res: NextApiResponse, 
  req: NextApiRequest
): SearchAllProjectsController {
  return new SearchAllProjectsController(
    new ProjectPrismaRepository(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))
}
