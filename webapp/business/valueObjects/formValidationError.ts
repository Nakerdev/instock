export default class FormValidationError<Error> {
    readonly fieldId: string;
    readonly error: Error;
    static create<ErrorT>(fieldId: string, errors: ErrorT[]) {
        return errors.map(error => new FormValidationError(fieldId, error));
    }
    constructor(fieldId: string, error: Error) {
        this.fieldId = fieldId;
        this.error = error;
    }
}
