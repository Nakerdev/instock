import { NextApiResponse } from "next";
import FormValidationError from "../../../../business/valueObjects/formValidationError";
import { ValidationError } from "../../../../business/valueObjects/validationError";

export type ResponseBody = object | string | Array<object>;

export interface ApiResponseBuilder {
  sendSuccessResponse(responseBody: ResponseBody): void;
  sendValidationErrorResponse(formValidationErrors: FormValidationError<ValidationError>[]): void;
  sendCommandErrorResponse(commandError: string): void;
}

export function nextApiResponseBuilder(
  res: NextApiResponse
): ApiResponseBuilder {

  return {
    sendSuccessResponse,
    sendValidationErrorResponse: sendValidtionErrorResponse,
    sendCommandErrorResponse
  };

  function sendSuccessResponse(responseBody: ResponseBody): void {
    res.status(200).json(responseBody);
  }

  function sendValidtionErrorResponse(formValidationErrors: FormValidationError<ValidationError>[]): void {
    res.status(404).json(formValidationErrors);
  }

  function sendCommandErrorResponse(commandError: string): void {
    res.status(404).json({commandError: commandError});
  }
}
