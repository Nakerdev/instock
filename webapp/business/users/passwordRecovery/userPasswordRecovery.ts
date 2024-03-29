import { Option, some, none, isNone } from 'fp-ts/lib/Option'

import UserRepository from '../userRepository'
import { UserPasswordRecoveryRequest } from './UserPasswordRecoveryRequest'
import UserPasswordRecoveryEmailSender, { UserPasswordRecoveryEmailSendingRequest } from '../../notifications/emails/userPasswordRecoveryEmailSender'
import TimeService from '../../infraestructure/timeService'
import { User } from '../user'
import { ExpirationDate } from '../../valueObjects/expirationDate'

export {
  UserPasswordRecovery,
  UserPasswordRecoveryError
}

class UserPasswordRecovery {
  readonly userRepository: UserRepository
  readonly timeService: TimeService
  readonly userPasswordRecoveryEmailSender: UserPasswordRecoveryEmailSender

  constructor (
    userRepository: UserRepository,
    timeService: TimeService,
    userPasswordRecoveryEmailSender: UserPasswordRecoveryEmailSender
  ) {
    this.userRepository = userRepository
    this.timeService = timeService
    this.userPasswordRecoveryEmailSender = userPasswordRecoveryEmailSender
  }

  async recovery (request: UserPasswordRecoveryRequest): Promise<Option<UserPasswordRecoveryError>> {
    const user = await this.userRepository.searchByEmail(request.email)
    if (isNone(user)) return some(UserPasswordRecoveryError.UserNotFound)
    this.sendPasswordRecoveryEmail(user.value)
    return none
  }

  private sendPasswordRecoveryEmail (user: User): void {
    const emailSendingRequest = new UserPasswordRecoveryEmailSendingRequest(
      user.id,
      user.email,
      user.name,
      this.builPasswordChangePetitionExpirationDate()
    )
    this.userPasswordRecoveryEmailSender.send(emailSendingRequest)
  }

  private builPasswordChangePetitionExpirationDate (): ExpirationDate {
    const ONE_DAY_MORE = 1
    const passwordChangePetitionExpirationDate = this.timeService.utcNow()
    passwordChangePetitionExpirationDate.setDate(passwordChangePetitionExpirationDate.getDate() + ONE_DAY_MORE)
    return new ExpirationDate(passwordChangePetitionExpirationDate)
  }
}

enum UserPasswordRecoveryError {
    UserNotFound = 'UserNotFound'
}
