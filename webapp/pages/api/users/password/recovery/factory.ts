import { NextApiResponse } from 'next'

import { nextApiResponseBuilder } from '../../../utils/apiUtils'
import { UserPasswordRecoveryController } from './controller'
import { UserPasswordRecovery } from '../../../../../business/users/passwordRecovery/userPasswordRecovery'
import UserPrismaRepository from '../../../../../infraestructure/users/userRepository'
import SystemTimeService from '../../../../../infraestructure/systemTimeService'
import UserPasswordRecoveryEmailSender from '../../../../../infraestructure/notifications/emails/userPasswordRecoveryEmailSender'
import ServiceFactory from '../../../factory/serviceFactory'
import JsonSerializer from '../../../../../infraestructure/jsonSerializer'
import Aes256EncryptionService from '../../../../../infraestructure/security/cryptography/encryptionService'
import { enviromentConfiguration } from '../../../../../enviromentConfiguration'
import Base64UrlEncoder from '../../../../../infraestructure/security/cryptography/base64UrlEncoder'

export function buildUserPasswordRecoveryController (res: NextApiResponse): UserPasswordRecoveryController {
  return new UserPasswordRecoveryController(
    buildCommand(),
    nextApiResponseBuilder(res))

  function buildCommand (): UserPasswordRecovery {
    return new UserPasswordRecovery(
      new UserPrismaRepository(),
      new SystemTimeService(),
      buildPasswordRecoveryEmailSender())
  }

  function buildPasswordRecoveryEmailSender(): UserPasswordRecoveryEmailSender {
    return new UserPasswordRecoveryEmailSender(
      ServiceFactory.buildSendGridEmailService(),
      new JsonSerializer(),
      new Aes256EncryptionService(enviromentConfiguration.SYMETRIC_ENCRYPTION_KEY),
      new Base64UrlEncoder(),
      enviromentConfiguration.NO_REPPLY_EMAIL,
      enviromentConfiguration.WEBAPP_BASE_URL,
      enviromentConfiguration.SUPPORT_EMAIL
    )
  }
}
