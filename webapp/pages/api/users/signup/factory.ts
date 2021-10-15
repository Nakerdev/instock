import { NextApiResponse } from 'next'

import { nextApiResponseBuilder } from '../../utils/apiUtils'
import { UserSignUpController } from './controller'
import { enviromentConfiguration } from '../../../../enviromentConfiguration'
import { UserSignUp } from '../../../../business/users/signUp/userSignUp'
import UserPrismaRepository from '../../../../infraestructure/users/userRepository'
import SystemUuidService from '../../../../infraestructure/security/cryptography/uuidService'
import BCryptPasswordHasingService from '../../../../infraestructure/security/cryptography/passwordHashingService'
import SystemTimeService from '../../../../infraestructure/systemTimeService'

export function buildUserSignUpController (res: NextApiResponse): UserSignUpController {
  return new UserSignUpController(
    buildCommand(),
    nextApiResponseBuilder(res),
    enviromentConfiguration)

  function buildCommand (): UserSignUp {
    return new UserSignUp(
      new UserPrismaRepository(),
      new BCryptPasswordHasingService(),
      new SystemUuidService(),
      new SystemTimeService())
  }
}
