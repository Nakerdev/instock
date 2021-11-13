import { NextApiResponse, NextApiRequest } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { UserLoginController } from './controller'
import UserPrismaRepository from '../../../../infraestructure/users/userRepository'
import BCryptPasswordHasingService from '../../../../infraestructure/security/cryptography/passwordHashingService'
import { UserLogin } from '../../../../business/users/login/userLogin'
import ServiceFactory from '../../factory/serviceFactory'

export function buildUserLoginController (res: NextApiResponse, req: NextApiRequest): UserLoginController {
  return new UserLoginController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService(req))

  function buildCommand (): UserLogin {
    return new UserLogin(
      new UserPrismaRepository(),
      new BCryptPasswordHasingService())
  }
}
