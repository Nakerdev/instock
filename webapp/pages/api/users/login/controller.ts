import jwt from "jsonwebtoken";
import { match } from "fp-ts/Either";
import { pipe } from "fp-ts/pipeable";

import { ApiResponseBuilder } from "../../utils/apiUtils";
import { EnviromentConfiguration, enviromentConfiguration } from "../../../../enviromentConfiguration";
import { User } from "../../../../business/users/user";
import { UserLoginRequestDto, UserLoginRequest } from "../../../../business/users/login/UserLoginRequest";
import { UserLogin } from "../../../../business/users/login/userLogin";

export {
  UserLoginController,
  UserLoginControllerRequest
}

class UserLoginController {

  readonly command: UserLogin;
  readonly apiResponseBuilder: ApiResponseBuilder;
  readonly enviromentConfiguration: EnviromentConfiguration;

  constructor(
    command: UserLogin,
    apiResponseBuilder: ApiResponseBuilder,
    enviromentConfiguration: EnviromentConfiguration
  ){
      this.command = command;
      this.apiResponseBuilder = apiResponseBuilder;
      this.enviromentConfiguration = enviromentConfiguration;
  }

  login(request: UserLoginControllerRequest): void {
    pipe(
      this.buildCommandRequest(request),
      match(
        _ => this.apiResponseBuilder.sendUnauthorizedResponse(),
        request => this.executeCommand(request)
      )
    )
  }

  private async executeCommand(request: UserLoginRequest): Promise<void> {
    pipe(
      await this.command.login(request),
      match(
        _ => this.apiResponseBuilder.sendUnauthorizedResponse(),
        createdUser => this.createSessionTokenAndBuildSuccessResponse(createdUser)
      )
    );
  }  

  private createSessionTokenAndBuildSuccessResponse(createdUser: User): void {
    const tokenPayload = { userId: createdUser.id };
    const tokenConfig = { expiresIn: '7d' };
    const sessionToken = jwt.sign(tokenPayload, enviromentConfiguration.JWT_SECRET_KEY, tokenConfig);
    const response = new ResponseDto(sessionToken);
    this.apiResponseBuilder.sendSuccessResponse(response);
  }

  private buildCommandRequest(request: UserLoginControllerRequest){
      const commandRequestDto = new UserLoginRequestDto(
        request.email,
        request.password
      );
      return UserLoginRequest.create(commandRequestDto);
  }
}

class UserLoginControllerRequest {
  readonly email: string;
  readonly password: string;

  constructor(
    email: string,
    password: string,
  ) {
     this.email = email;
     this.password = password;
  }
}

class ResponseDto {
  token: string;

  constructor(token: string){
    this.token = token;
  }
}