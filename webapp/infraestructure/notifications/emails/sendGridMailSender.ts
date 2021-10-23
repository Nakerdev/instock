import sendGridMail from '@sendgrid/mail'

import MailService, { MailSendingRequest } from '../../../business/infraestructure/mailService'
import Logger, { Log } from '../../../business/monitoring/logger'

export default class SendGridMailService implements MailService {

  readonly logger: Logger;

  constructor (
    logger: Logger,
    sendGridApiKey: string
  ) {
    this.logger = logger
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
      .then(() => { 
        //do nothing
      })
      .catch((error) => {
        const code = error.response.code
        const errors = JSON.stringify(error.response.body)
        const log = new Log(`Can not send email to ${request.to}. [httpStatusCode: ${code}, subject: ${request.subject}, error: ${errors}]`)
        this.logger.logError(log)
      })
  }
}
