export default interface UserPasswordRecoveryEmailSender {
    send(request: UserPasswordRecoveryEmailSendingRequest): Promise<void>;
}

export class UserPasswordRecoveryEmailSendingRequest {
  readonly userId: string
  readonly passwordChangePetitionExpirationDate: Date

  constructor (
    userId: string,
    passwordChangePetitionExpirationDate: Date
  ) {
    this.userId = userId
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}
