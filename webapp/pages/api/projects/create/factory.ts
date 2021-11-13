import { NextApiResponse } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { CreateProjectController } from './controller'
import ProjectPrismaRepository from '../../../../infraestructure/projects/projectRepository'
import UserPrismaRepository from '../../../../infraestructure/users/userRepository'
import SystemUuidService from '../../../../infraestructure/security/cryptography/uuidService'
import SystemTimeService from '../../../../infraestructure/systemTimeService'
import ServiceFactory from '../../factory/serviceFactory'
import { CreateProject } from '../../../../business/projects/create/createProject'

export function buildCreateProjectController (res: NextApiResponse): CreateProjectController {
  return new CreateProjectController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(res))

  function buildCommand (): CreateProject {
    return new CreateProject(
      new ProjectPrismaRepository(),
      new UserPrismaRepository,
      new SystemUuidService(),
      new SystemTimeService())
  }
}
