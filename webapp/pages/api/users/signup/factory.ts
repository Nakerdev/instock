import { NextApiResponse } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { UserSignUpController } from './controller'
import { UserSignUp } from '../../../../business/users/signUp/userSignUp'
import UserPrismaRepository from '../../../../infraestructure/users/userRepository'
import SystemUuidService from '../../../../infraestructure/security/cryptography/uuidService'
import BCryptPasswordHasingService from '../../../../infraestructure/security/cryptography/passwordHashingService'
import SystemTimeService from '../../../../infraestructure/systemTimeService'
import ServiceFactory from '../../factory/serviceFactory'

export function buildUserSignUpController (res: NextApiResponse): UserSignUpController {
  return new UserSignUpController(
    buildCommand(),
    nextApiResponseBuilder(res),
    ServiceFactory.buildSessionService())

  function buildCommand (): UserSignUp {
    return new UserSignUp(
      new UserPrismaRepository(),
      new BCryptPasswordHasingService(),
      new SystemUuidService(),
      new SystemTimeService())
  }
}
