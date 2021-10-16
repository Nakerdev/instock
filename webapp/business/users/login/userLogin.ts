import { isNone } from 'fp-ts/lib/Option'
import { Either, right, left } from 'fp-ts/lib/Either'

import PasswordHashingService from '../../security/cryptography/passwordHashingService'
import UserRepository from '../userRepository'
import { User } from '../user'
import { UserLoginRequest } from './UserLoginRequest'

export {
  UserLogin,
  UserLoginError
}

class UserLogin {
  readonly userRepository: UserRepository
  readonly passwordHashingService: PasswordHashingService

  constructor (
    userRepository: UserRepository,
    passwordHashingService: PasswordHashingService
  ) {
    this.userRepository = userRepository
    this.passwordHashingService = passwordHashingService
  }

  async login (request: UserLoginRequest): Promise<Either<UserLoginError, User>> {
    const user = await this.userRepository.searchByEmail(request.email)
    if (isNone(user)) return left(UserLoginError.UserNotFound)
    const isTheSamePassword = await user.value.password.compare(this.passwordHashingService, request.password)
    if (!isTheSamePassword) return left(UserLoginError.InvalidCredentials)
    return right(user.value)
  }
}

enum UserLoginError {
    UserNotFound = 'UserNotFound',
    InvalidCredentials = 'InvalidCredentials'
}
