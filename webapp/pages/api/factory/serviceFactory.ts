import SessionService, { JwtSessionService } from '../../../application/session/sessionService'
import { enviromentConfiguration } from '../../../enviromentConfiguration'
import MailService from '../../../business/infraestructure/mailService'
import SendGridMailService from '../../../infraestructure/notifications/emails/sendGridMailSender'
import PrismaDbLogger from '../../../infraestructure/monitoring/prismaDbLogger'

export default class ServiceFactory {
  static buildSessionService (): SessionService {
    return new JwtSessionService(enviromentConfiguration.JWT_SECRET_KEY)
  }

  static buildSendGridEmailService (): MailService {
    return new SendGridMailService(
      new PrismaDbLogger(enviromentConfiguration.SOURCE),
      enviromentConfiguration.SENDGRID_API_KEY)
  }
}
