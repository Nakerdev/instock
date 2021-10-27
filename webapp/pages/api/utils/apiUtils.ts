import { NextApiResponse } from 'next'
import FormValidationError from '../../../business/types/formValidationError'
import { ValidationError } from '../../../business/types/validationError'

export type ResponseBody = object | string | Array<object>;

export interface ApiResponseBuilder {
  sendSuccessResponse(responseBody: ResponseBody): void;
  sendValidationErrorResponse(formValidationErrors: FormValidationError<ValidationError>[]): void;
  sendCommandErrorResponse(commandError: string): void;
  sendUnauthorizedResponse(): void;
}

export class ErrorResponse {
  validationErrors: FormValidationError<ValidationError>[];
  commandError: string | null;

  constructor(
    validationErrors: FormValidationError<ValidationError>[],
    commandError: string | null
  ){
    this.validationErrors = validationErrors;
    this.commandError = commandError;
  }
}

export function nextApiResponseBuilder (
  res: NextApiResponse
): ApiResponseBuilder {
  return {
    sendSuccessResponse,
    sendValidationErrorResponse: sendValidtionErrorResponse,
    sendCommandErrorResponse,
    sendUnauthorizedResponse
  }

  function sendSuccessResponse (responseBody: ResponseBody): void {
    res.status(200).json(responseBody)
  }

  function sendValidtionErrorResponse (formValidationErrors: FormValidationError<ValidationError>[]): void {
    const error = new ErrorResponse(formValidationErrors, null)
    res.status(404).json(error)
  }

  function sendCommandErrorResponse (commandError: string): void {
    const error = new ErrorResponse([], commandError)
    res.status(404).json(error)
  }

  function sendUnauthorizedResponse (): void {
    res.status(401).send()
  }
}
