import jwt from 'jsonwebtoken'

import { User } from '../../business/users/user'

export default interface SessionService {
    create(user: User): string;
}

export class JwtSessionService implements SessionService {
  readonly jwtSecretKey: string

  constructor (jwtSecretKey: string) {
    this.jwtSecretKey = jwtSecretKey
  }

  create (user: User): string {
    const tokenPayload = { userId: user.id.state.value }
    const tokenConfig = { expiresIn: '30d' }
    return jwt.sign(tokenPayload, this.jwtSecretKey, tokenConfig)
  }
}
