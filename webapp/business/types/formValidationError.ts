export default class FormValidationError<Error> {
  readonly fieldId: string
  readonly error: Error

  constructor (fieldId: string, error: Error) {
    this.fieldId = fieldId
    this.error = error
  }
}
