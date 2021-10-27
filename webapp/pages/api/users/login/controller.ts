import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from '../../utils/apiUtils'
import { User } from '../../../../business/users/user'
import { UserLoginRequestDto, UserLoginRequest } from '../../../../business/users/login/UserLoginRequest'
import { UserLogin } from '../../../../business/users/login/userLogin'
import SessionService from '../../../../application/session/sessionService'

export {
  UserLoginController,
  UserLoginControllerRequest,
  ResponseDto
}

class UserLoginController {
  readonly command: UserLogin
  readonly apiResponseBuilder: ApiResponseBuilder
  readonly sessionService: SessionService

  constructor (
    command: UserLogin,
    apiResponseBuilder: ApiResponseBuilder,
    sessionService: SessionService
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
    this.sessionService = sessionService
  }

  login (request: UserLoginControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      match(
        _ => this.apiResponseBuilder.sendUnauthorizedResponse(),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: UserLoginRequest): Promise<void> {
    pipe(
      await this.command.login(request),
      match(
        _ => this.apiResponseBuilder.sendUnauthorizedResponse(),
        createdUser => this.createSessionTokenAndBuildSuccessResponse(createdUser)
      )
    )
  }

  private createSessionTokenAndBuildSuccessResponse (createdUser: User): void {
    const sessionToken = this.sessionService.create(createdUser)
    const response = new ResponseDto(sessionToken)
    this.apiResponseBuilder.sendSuccessResponse(response)
  }

  private buildCommandRequest (request: UserLoginControllerRequest) {
    const commandRequestDto = new UserLoginRequestDto(
      request.email,
      request.password
    )
    return UserLoginRequest.create(commandRequestDto)
  }
}

class UserLoginControllerRequest {
  readonly email: string
  readonly password: string

  constructor (
    email: string,
    password: string
  ) {
    this.email = email
    this.password = password
  }
}

class ResponseDto {
  token: string

  constructor (token: string) {
    this.token = token
  }
}
