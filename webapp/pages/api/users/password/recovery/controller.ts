import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../../utils/apiUtils'
import { UserPasswordRecovery } from '../../../../../business/users/passwordRecovery/userPasswordRecovery'
import { UserPasswordRecoveryRequest, UserPasswordRecoveryRequestDto } from '../../../../../business/users/passwordRecovery/UserPasswordRecoveryRequest'

export {
  UserPasswordRecoveryController,
  UserPasswordRecoveryControllerRequest
}

class UserPasswordRecoveryController {
  readonly command: UserPasswordRecovery
  readonly apiResponseBuilder: ApiResponseBuilder

  constructor (
    command: UserPasswordRecovery,
    apiResponseBuilder: ApiResponseBuilder
  ) {
    this.command = command
    this.apiResponseBuilder = apiResponseBuilder
  }

  recovery (request: UserPasswordRecoveryControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      match(
        _ => this.apiResponseBuilder.sendSuccessResponse({}),
        request => this.executeCommand(request)
      )
    )
  }

  private executeCommand (request: UserPasswordRecoveryRequest): void {
      this.command.recovery(request)
      return this.apiResponseBuilder.sendSuccessResponse({})
  }

  private buildCommandRequest (request: UserPasswordRecoveryControllerRequest) {
    const commandRequestDto = new UserPasswordRecoveryRequestDto(
      request.email
    )
    return UserPasswordRecoveryRequest.create(commandRequestDto)
  }
}

class UserPasswordRecoveryControllerRequest {
  readonly email: string;

  constructor(email: string){
    this.email = email
  }
}
