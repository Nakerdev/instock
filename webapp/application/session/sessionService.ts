import jwt from 'jsonwebtoken'
import { Option, some, none } from 'fp-ts/lib/Option'
import { NextApiRequest } from 'next'

import { User } from '../../business/users/user'

export default interface SessionService {
    create(user: User): string;
    currentUser(): Option<UserSession>;
}

export class JwtSessionService implements SessionService {
  readonly jwtSecretKey: string
  readonly req: NextApiRequest

  constructor (jwtSecretKey: string, req: NextApiRequest) {
    this.jwtSecretKey = jwtSecretKey
    this.req = req
  }

  create (user: User): string {
    const tokenPayload: SessionToken = { userId: user.id.state.value }
    const tokenConfig = { expiresIn: '30d' }
    return jwt.sign(tokenPayload, this.jwtSecretKey, tokenConfig)
  }

  currentUser (): Option<UserSession> {
    const sessionToken = this.req.headers['x-stockout-token']
    try {
      const decodedToken = <SessionToken>jwt.verify(sessionToken, this.jwtSecretKey)
      const userSession = new UserSession(decodedToken.userId)
      return some(userSession)
    } catch {
      return none
    }
  }
}

export class UserSession {
  userId: string

  constructor (userId: string) {
    this.userId = userId
  }
}

interface SessionToken {
  userId: string;
}
