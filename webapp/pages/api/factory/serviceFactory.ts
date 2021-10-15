import SessionService, { JwtSessionService } from '../../../application/session/sessionService'
import { enviromentConfiguration } from '../../../enviromentConfiguration'

export default class ServiceFactory {
  static buildSessionService (): SessionService {
    return new JwtSessionService(enviromentConfiguration)
  }
}
