import { NextApiResponse } from 'next'

import { nextApiResponseBuilder } from '../../../utils/apiUtils'
import { UserChangePasswordController } from './controller'
import UserPrismaRepository from '../../../../../infraestructure/users/userRepository'
import SystemTimeService from '../../../../../infraestructure/systemTimeService'
import JsonSerializer from '../../../../../infraestructure/jsonSerializer'
import Aes256EncryptionService from '../../../../../infraestructure/security/cryptography/encryptionService'
import { enviromentConfiguration } from '../../../../../enviromentConfiguration'
import Base64UrlEncoder from '../../../../../infraestructure/security/cryptography/base64UrlEncoder'
import { ChangeUserPassword } from '../../../../../business/users/changePassword/changeUserPassword'
import BCryptPasswordHasingService from '../../../../../infraestructure/security/cryptography/passwordHashingService'

export function buildUserChangePasswordController (res: NextApiResponse): UserChangePasswordController {
  return new UserChangePasswordController(
    buildCommand(),
    new Base64UrlEncoder(),
    new JsonSerializer(),
    new Aes256EncryptionService(enviromentConfiguration.SYMETRIC_ENCRYPTION_KEY),
    nextApiResponseBuilder(res))

  function buildCommand (): ChangeUserPassword {
    return new ChangeUserPassword(
      new UserPrismaRepository(),
      new BCryptPasswordHasingService(),
      new SystemTimeService())
  }
}
