import IUserPasswordRecoveryEmailSender, { UserPasswordRecoveryEmailSendingRequest } from "../../../business/notifications/emails/userPasswordRecoveryEmailSender";
import MailService, { MailSendingRequest } from "../../../business/infraestructure/mailService";

export default class UserPasswordRecoveryEmailSender implements IUserPasswordRecoveryEmailSender  {

    readonly mailService: MailService;

    constructor(mailService: MailService){
        this.mailService = mailService;
    }

    send(request: UserPasswordRecoveryEmailSendingRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private buildEmailTemplate(
       userName: string, 
       userEmail: string, 
       resetPasswordUrl: string
    ) {
        return `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <title>Reset your InStock password</title>
                <style>
                    body {
                        background-color: #EFEFEF;
                        margin: 20px 20px;
                    }
                    h1 {
                        color: #171616;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #171616
                    }
                    a {
                        background-color: #FF3B3F;
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 20px;
                        font-weight: bold;
                        border-radius: 10px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }

                    p {
                        color: #171616;
                        font-size: 18px;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        line-height: 1.4em;
                    }

                    .main {
                        display: flex;
                        flex-direction: column;
                    }

                    .footer {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .footer > p {
                        color: #A9A9A9;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>
                    InStock
                    </h1>
                </div>
                <div class="main">
                <p>
                    Hello ${userName},
                </p>
                <p>
                    We've received a request to reset the password for the InStock account
                    associated with ${userEmail}. No changes have been made to your account
                    yet.
                </p>
                <p>
                    You can reset your password by clicking the link below:
                </p>
                <a href="${resetPasswordUrl}" target="_blank">Reset your password</a>
                <p>
                    If you did not request a new password, please ignore this notification.
                </p>
                <p>
                    -- The InStock Team
                </p>
                </div>
                <div class="footer">
                    <p>
                    Problems or questions? send an email to support@instock.com
                    </p>
                    <p>
                    © InStock
                    </p>
                </div>
            </body>
            </html>
        `
    }
}