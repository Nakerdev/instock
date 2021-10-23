export default interface Logger {
    logInfo(log: Log): Promise<void>;
    logError(log: Log): Promise<void>;
}

export class Log {
    readonly message: string;
    readonly exception: string;

    constructor(
        message: string,
        exception: string,
    ){
        this.message = message;
        this.exception = exception;
    }
}