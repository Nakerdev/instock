import IUserPasswordRecoveryEmailSender, { UserPasswordRecoveryEmailSendingRequest } from '../../../business/notifications/emails/userPasswordRecoveryEmailSender'
import MailService, { MailSendingRequest } from '../../../business/infraestructure/mailService'
import Serializer from '../../../business/infraestructure/serializer'
import EncryptionService from '../../../business/security/cryptography/encryptionService'
import UrlEncoder from '../../../business/security/cryptography/urlEncoder'
import { UserId } from '../../../business/valueObjects/userId'
import { ExpirationDate } from '../../../business/valueObjects/expirationDate'

export default class UserPasswordRecoveryEmailSender implements IUserPasswordRecoveryEmailSender {
  readonly mailService: MailService
  readonly serializer: Serializer
  readonly encryptionService: EncryptionService
  readonly urlEncoder: UrlEncoder
  readonly noReplyEmail: string
  readonly webAppBaseUrl: string
  readonly supportEmail: string

  private readonly userPasswordRecoveryPageEndpoint = '/change-password?t={token}'
  private readonly emailSubject = 'Reset your StockOut password'

  constructor (
    mailService: MailService,
    serializer: Serializer,
    encryptionService: EncryptionService,
    urlEncoder: UrlEncoder,
    noReplyEmail: string,
    webAppBaseUrl: string,
    supportEmail: string
  ) {
    this.mailService = mailService
    this.serializer = serializer
    this.encryptionService = encryptionService
    this.urlEncoder = urlEncoder
    this.noReplyEmail = noReplyEmail
    this.webAppBaseUrl = webAppBaseUrl
    this.supportEmail = supportEmail
  }

  send (request: UserPasswordRecoveryEmailSendingRequest): void {
    const token = this.createToken(request.userId, request.passwordChangePetitionExpirationDate)
    const resetPasswordUrl = this.webAppBaseUrl + this.userPasswordRecoveryPageEndpoint.replace('{token}', token)

    const html = this.buildEmailTemplate(
      request.userName.state.value,
      request.userEmail.state.value,
      resetPasswordUrl,
      this.supportEmail)
    const mailSendingRequest = new MailSendingRequest(
      request.userEmail.state.value,
      this.noReplyEmail,
      this.emailSubject,
      html
    )

    this.mailService.send(mailSendingRequest)
  }

  createToken (
    userId: UserId,
    passwordChangePetitionExpirationDate: ExpirationDate
  ): string {
    const token = new Token(
      userId.state.value,
      passwordChangePetitionExpirationDate.state.value)
    const serializedToken = this.serializer.serialize(token)
    const encryptedToken = this.encryptionService.encrypt(serializedToken)
    const serializedEncryptedToken = this.serializer.serialize(encryptedToken)
    return this.urlEncoder.encode(serializedEncryptedToken)
  }

  private buildEmailTemplate (
    userName: string,
    userEmail: string,
    resetPasswordUrl: string,
    supportEmail: string
  ) {
    return `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <title>Reset your StockOut password</title>
            </head>
            <body style="background-color: #fff; max-width: 800px; margin: 0 auto;">
              <div style="background-color: #fff; margin: 20px;padding-top: 10px; padding-bottom: 10px;">
                <div>
                  <h1 style="color: #171616;padding-bottom: 10px;border-bottom: 1px solid #EFEFEF">
                    StockOut
                  </h1>
                </div>
                <div>
                  <p style="color: #171616;font-size: 18px;margin-top: 10px;margin-bottom: 10px;line-height: 1.4em;">
                      Hello ${userName},
                  </p>
                  <p style="color: #171616;font-size: 18px;margin-top: 10px;margin-bottom: 10px;line-height: 1.4em;">
                      We've received a request to reset the password for the StockOut account
                      associated with ${userEmail}. No changes have been made to your account
                      yet.
                  </p>
                  <p style="color: #171616;font-size: 18px;margin-top: 10px;margin-bottom: 10px;line-height: 1.4em;">
                      You can reset your password by clicking the link below:
                  </p>
                  <div style="display:block; margin: 0 auto; box-sizing: border-box;">
                    <a clicktracking=off href="${resetPasswordUrl}" target="_blank" style="background-color: #FF3B3F;border: none;color: white;padding: 10px;text-align: center;text-decoration: none;display: inline-block;font-size: 20px;border-radius: 10px;margin-top: 10px;margin-bottom: 10px;width:100%; box-sizing: border-box;">
                      Reset your password
                    </a>
                  </div>
                  <p style="color: #171616;font-size: 18px;margin-top: 10px;margin-bottom: 10px;line-height: 1.4em;">
                      If you did not request a new password, please ignore this notification.
                  </p>
                  <p style="color: #171616;font-size: 18px;margin-top: 10px;margin-bottom: 10px;line-height: 1.4em;">
                      -- The StockOut Team
                  </p>
                </div>
                <div>
                  <p style="color: #A9A9A9;font-size: 14px;">
                    Problems or questions? send an email to ${supportEmail}
                  </p>
                  <p style="color: #A9A9A9;font-size: 14px;">
                    © StockOut
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
        `
  }
}

class Token {
  readonly userId: string
  readonly passwordChangePetitionExpirationDate: Date

  constructor (userId: string, passwordChangePetitionExpirationDate: Date) {
    this.userId = userId
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}
