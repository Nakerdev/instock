import sendGridMail from '@sendgrid/mail'

import MailService, { MailSendingRequest } from '../../../business/infraestructure/mailService'

export default class SendGridMailService implements MailService {
  constructor (sendGridApiKey: string) {
    sendGridMail.setApiKey(sendGridApiKey)
  }

  send (request: MailSendingRequest): Promise<void> {
    const msg = {
      to: request.to,
      from: request.from,
      subject: request.subject,
      text: '',
      html: request.html
    }

    return sendGridMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
