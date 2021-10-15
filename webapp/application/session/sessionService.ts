import jwt from 'jsonwebtoken'

import { EnviromentConfiguration } from '../../enviromentConfiguration'
import { User } from '../../business/users/user'

export default interface SessionService {
    create(user: User): string;
}

export class JwtSessionService implements SessionService {
  readonly enviromentConfiguration: EnviromentConfiguration

  constructor (enviromentConfiguration: EnviromentConfiguration) {
    this.enviromentConfiguration = enviromentConfiguration
  }

  create (user: User): string {
    const tokenPayload = { userId: user.id }
    const tokenConfig = { expiresIn: '30d' }
    return jwt.sign(tokenPayload, this.enviromentConfiguration.JWT_SECRET_KEY, tokenConfig)
  }
}
