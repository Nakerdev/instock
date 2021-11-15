import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { UpdateProjectController } from './controller'
import ProjectPrismaRepository from '../../../../infraestructure/projects/projectRepository'
import ServiceFactory from '../../factory/serviceFactory'
import { UpdateProject } from '../../../../business/projects/update/updateProject'

export function buildUpdateProjectController (res: NextApiResponse, req: NextApiRequest): UpdateProjectController {
  return new UpdateProjectController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))

  function buildCommand (): UpdateProject {
    return new UpdateProject (new ProjectPrismaRepository())
  }
}
