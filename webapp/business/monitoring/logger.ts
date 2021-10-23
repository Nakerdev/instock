import { sort } from "fp-ts/lib/ReadonlyNonEmptyArray";

export default interface Logger {
    logInfo(log: Log): void;
    lofError(log: Log): void;
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