import { match as optionEither } from 'fp-ts/Either'
import { match as optionMatch } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from './../../../utils/apiUtils'
import { UserPasswordRecovery } from '../../../../../business/users/passwordRecovery/userPasswordRecovery'
import { UserPasswordRecoveryRequest, UserPasswordRecoveryRequestDto } from '../../../../../business/users/passwordRecovery/UserPasswordRecoveryRequest'
import Logger, { Log } from '../../../../../business/monitoring/logger'

export {
  UserPasswordRecoveryController,
  UserPasswordRecoveryControllerRequest
}

class UserPasswordRecoveryController {
  readonly command: UserPasswordRecovery
  readonly logger: Logger
  readonly apiResponseBuilder: ApiResponseBuilder

  constructor (
    command: UserPasswordRecovery,
    logger: Logger,
    apiResponseBuilder: ApiResponseBuilder
  ) {
    this.command = command
    this.logger = logger
    this.apiResponseBuilder = apiResponseBuilder
  }

  recovery (request: UserPasswordRecoveryControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      optionEither(
        errors => {
          const serializedErrors = JSON.stringify(errors)
          const log = new Log(`Validaiton error in user password recovery. [errors: ${serializedErrors}]`)
          this.logger.logInfo(log)
          this.apiResponseBuilder.sendSuccessResponse({})
        },
        async request => await this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: UserPasswordRecoveryRequest): Promise<void> {
    pipe(
      await this.command.recovery(request),
      optionMatch(
        () => this.apiResponseBuilder.sendSuccessResponse({}),
        error => {
          const log = new Log(`Command error in user password recovery. [error: ${error}]`)
          this.logger.logInfo(log)
          this.apiResponseBuilder.sendSuccessResponse({})
        }
      )
    )
  }

  private buildCommandRequest (request: UserPasswordRecoveryControllerRequest) {
    const commandRequestDto = new UserPasswordRecoveryRequestDto(
      request.email
    )
    return UserPasswordRecoveryRequest.create(commandRequestDto)
  }
}

class UserPasswordRecoveryControllerRequest {
  readonly email: string

  constructor (email: string) {
    this.email = email
  }
}
