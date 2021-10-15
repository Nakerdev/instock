import { Option, some, none } from 'fp-ts/lib/Option'

import UserRepository from '../userRepository'
import { UserPasswordRecoveryRequest } from './UserPasswordRecoveryRequest'

export {
  UserPasswordRecovery,
  UserPasswordRecoveryError
}

class UserPasswordRecovery {
  readonly userRepository: UserRepository

  constructor (
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository
  }

  async recovery (request: UserPasswordRecoveryRequest): Promise<Option<UserPasswordRecoveryError>> {
    const existUser = await this.userRepository.exist(request.email)
    if (!existUser) return some(UserPasswordRecoveryError.UserNotFound)
    return none;
  }
}

enum UserPasswordRecoveryError {
    UserNotFound = 'UserNotFound'
}
