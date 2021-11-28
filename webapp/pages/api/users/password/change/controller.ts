import { match as optionEither } from 'fp-ts/Either'
import { match as optionMatch } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import { ApiResponseBuilder } from '../../../utils/apiUtils'
import { ChangeUserPassword } from '../../../../../business/users/changePassword/changeUserPassword'
import { UserChangePasswordRequest, UserChangePasswordRequestDto } from '../../../../../business/users/changePassword/UserChangePasswordRequest'
import UrlEncoder from '../../../../../business/security/cryptography/urlEncoder'
import Serializer from '../../../../../business/infraestructure/serializer'
import EncryptionService, { EncryptedResult } from '../../../../../business/security/cryptography/encryptionService'

export {
  UserChangePasswordController,
  UserChangePasswordControllerRequest
}

class UserChangePasswordController {
  readonly command: ChangeUserPassword
  readonly urlEncoder: UrlEncoder
  readonly serializer: Serializer
  readonly encryptionService: EncryptionService
  readonly apiResponseBuilder: ApiResponseBuilder

  constructor (
    command: ChangeUserPassword,
    urlEncoder: UrlEncoder,
    serializer: Serializer,
    encryptionService: EncryptionService,
    apiResponseBuilder: ApiResponseBuilder
  ) {
    this.command = command
    this.urlEncoder = urlEncoder
    this.serializer = serializer
    this.encryptionService = encryptionService
    this.apiResponseBuilder = apiResponseBuilder
  }

  change (request: UserChangePasswordControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      optionEither(
        errors => this.apiResponseBuilder.sendValidationErrorResponse(errors),
        async request => await this.executeCommand(request)
      )
    )
  }

  private async executeCommand (request: UserChangePasswordRequest): Promise<void> {
    pipe(
      await this.command.change(request),
      optionMatch(
        () => this.apiResponseBuilder.sendSuccessResponse({}),
        error => this.apiResponseBuilder.sendCommandErrorResponse(error)
      )
    )
  }

  private buildCommandRequest (request: UserChangePasswordControllerRequest) {
    const token = this.decryptToken(request.token)
    const commandRequestDto = new UserChangePasswordRequestDto(
      token.userId,
      request.password,
      token.passwordChangePetitionExpirationDate
    )
    return UserChangePasswordRequest.create(commandRequestDto)
  }

  decryptToken (encryptedToken: string): Token {
    const decodedToken = this.urlEncoder.decode(encryptedToken)
    const encryptedResult = this.serializer.deserialize<EncryptedResult>(decodedToken)
    const decryptedResult = this.encryptionService.decrypt(encryptedResult)
    return this.serializer.deserialize<Token>(decryptedResult)
  }
}

class UserChangePasswordControllerRequest {
  readonly token: string
  readonly password: string

  constructor (token: string, password: string) {
    this.token = token
    this.password = password
  }
}

class Token {
  readonly userId: string
  readonly passwordChangePetitionExpirationDate: string

  constructor (userId: string, passwordChangePetitionExpirationDate: string) {
    this.userId = userId
    this.passwordChangePetitionExpirationDate = passwordChangePetitionExpirationDate
  }
}
