import SessionService, { JwtSessionService } from '../../../application/session/sessionService'
import { enviromentConfiguration } from '../../../enviromentConfiguration'
import MailService from '../../../business/infraestructure/mailService'
import SendGridMailService from '../../../infraestructure/notifications/emails/sendGridMailSender'
import PrismaDbLogger from '../../../infraestructure/monitoring/prismaDbLogger'
import Logger from '../../../business/monitoring/logger'
import { NextApiRequest } from 'next'

export default class ServiceFactory {
  static buildSessionService (req: NextApiRequest): SessionService {
    return new JwtSessionService(
      enviromentConfiguration.JWT_SECRET_KEY,
      req)
  }

  static buildSendGridEmailService (): MailService {
    return new SendGridMailService(
      this.buildPrismaDbLogger(),
      enviromentConfiguration.SENDGRID_API_KEY)
  }

  static buildPrismaDbLogger (): Logger {
    return new PrismaDbLogger(enviromentConfiguration.SOURCE)
  }
}
