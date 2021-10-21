import { UserId } from '../../valueObjects/userId'
import { ExpirationDate } from '../../valueObjects/expirationDate'
import { Email } from '../../valueObjects/email'
import { Name } from '../../valueObjects/name'

export default interface UserPasswordRecoveryEmailSender {
    send(request: UserPasswordRecoveryEmailSendingRequest): void;
}

export class UserPasswordRecoveryEmailSendingRequest {
  readonly userId: UserId
  readonly userEmail: Email
  readonly userName: Name
  readonly passwordChangePetitionExpirationDate: ExpirationDate

  constructor (
    userId: UserId,
    userEmail: Email,
    userName: Name,
    passwordChangePetitionExpirationDate: ExpirationDate
  ) {
    this.userId = userId
    this.userEmail = userEmail
    this.userName = userName
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}
