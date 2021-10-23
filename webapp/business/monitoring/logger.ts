export default interface Logger {
    logInfo(log: Log): Promise<void>;
    logError(log: Log): Promise<void>;
}

export class Log {
    readonly message: string;

    constructor(
        message: string,
    ){
        this.message = message;
    }
}