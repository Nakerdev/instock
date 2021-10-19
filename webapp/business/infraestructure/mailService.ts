export default interface MailService {
    send(request: MailSendingRequest): Promise<void>
}

export class MailSendingRequest {
    readonly to: string;
    readonly from: string;
    readonly subject: string;
    readonly html: string;

    constructor(
        to: string,
        from: string,
        subject: string,
        html: string
    ){
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.html = html;
    }
}