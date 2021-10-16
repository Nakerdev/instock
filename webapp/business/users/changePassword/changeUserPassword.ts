import { isNone, Option, some, none } from 'fp-ts/lib/Option'

import PasswordHashingService from '../../security/cryptography/passwordHashingService'
import UserRepository from '../userRepository'
import { UserChangePasswordRequest } from './UserChangePasswordRequest'
import { User } from '../user'
import { Password } from '../../valueObjects/password'
import TimeService from '../../infraestructure/timeService'

export {
  ChangeUserPassword,
  ChangeUserPasswordError
}

class ChangeUserPassword {
  readonly userRepository: UserRepository
  readonly passwordHashingService: PasswordHashingService
  readonly timeService: TimeService

  constructor (
    userRepository: UserRepository,
    passwordHashingService: PasswordHashingService,
    timeService: TimeService
  ) {
    this.userRepository = userRepository
    this.passwordHashingService = passwordHashingService
    this.timeService = timeService
  }

  async change (request: UserChangePasswordRequest): Promise<Option<ChangeUserPasswordError>> {
    const user = await this.userRepository.searchById(request.userId)
    if (isNone(user)) return some(ChangeUserPasswordError.UserNotFound)

    const isPasswordChangePetitionExpired = request.passwordChangePetitionExpirationDate.isExpired(this.timeService)
    if (isPasswordChangePetitionExpired) return some(ChangeUserPasswordError.PasswordChangePetitionExpired)

    const userWithNewPassword = await this.changeUserPassword(user.value, request.password)
    this.userRepository.update(userWithNewPassword)
    return none
  }

  private async changeUserPassword (currentUser: User, newPassword: Password): Promise<User> {
    const hashedPassword = await newPassword.hash(this.passwordHashingService)
    return new User(
      currentUser.id,
      currentUser.email,
      hashedPassword,
      currentUser.name,
      currentUser.surname,
      currentUser.signUpDate
    )
  }
}

enum ChangeUserPasswordError {
    UserNotFound = 'UserNotFound',
    PasswordChangePetitionExpired = 'PasswordChangePetitionExpired'
}
