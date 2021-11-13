import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../utils/apiUtils'
import { UserSignUp } from '../../../../business/users/signUp/userSignUp'
import { UserSignUpRequest, UserSignUpRequestDto } from '../../../../business/users/signUp/UserSignUpRequest'
import { User } from '../../../../business/users/user'
import SessionService from '../../../../application/session/sessionService'

export {
  UserSignUpController,
  UserSignUpControllerRequest,
  ResponseDto
}

class UserSignUpController {
  readonly command: UserSignUp
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: UserSignUp,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  signUp (request: UserSignUpControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      match(
        validationErrors => this.apiResponseBuilder.sendValidationErrorResponse(validationErrors),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: UserSignUpRequest): Promise<void> {
    pipe(
      await this.command.signUp(request),
      match(
        error => this.apiResponseBuilder.sendCommandErrorResponse(error.toString()),
        createdUser => this.createSessionTokenAndBuildSuccessResponse(createdUser)
      )
    )
  }

  private createSessionTokenAndBuildSuccessResponse (createdUser: User): void {
    const sessionToken = this.sessionService.create(createdUser)
    const response = new ResponseDto(sessionToken)
    this.apiResponseBuilder.sendSuccessResponse(response)
  }

  private buildCommandRequest (request: UserSignUpControllerRequest) {
    const commandRequestDto = new UserSignUpRequestDto(
      request.email,
      request.name,
      request.surname,
      request.password,
      request.areLegalTermsAndConditionsAccepted
    )
    return UserSignUpRequest.create(commandRequestDto)
  }
}

class UserSignUpControllerRequest {
  readonly email: string
  readonly password: string
  readonly name: string
  readonly surname: string
  readonly areLegalTermsAndConditionsAccepted: string

  constructor (
    email: string,
    password: string,
    name: string,
    surname: string,
    areLegalTermsAndConditionsAccepted: string
  ) {
    this.email = email
    this.password = password
    this.name = name
    this.surname = surname
    this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted
  }
}

class ResponseDto {
  token: string

  constructor (token: string) {
    this.token = token
  }
}
