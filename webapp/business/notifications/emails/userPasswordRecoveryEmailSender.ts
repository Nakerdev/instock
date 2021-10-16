import { UserId } from '../../valueObjects/userId'
import { ExpirationDate } from '../../valueObjects/expirationDate'

export default interface UserPasswordRecoveryEmailSender {
    send(request: UserPasswordRecoveryEmailSendingRequest): Promise<void>;
}

export class UserPasswordRecoveryEmailSendingRequest {
  readonly userId: UserId
  readonly passwordChangePetitionExpirationDate: ExpirationDate

  constructor (
    userId: UserId,
    passwordChangePetitionExpirationDate: ExpirationDate
  ) {
    this.userId = userId
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}
