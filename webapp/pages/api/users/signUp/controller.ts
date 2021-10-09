import jwt from "jsonwebtoken";

import { ApiResponseBuilder } from "./apiUtils";
import { UserSignUp } from "../../../../business/users/signUp/userSignUp";
import UserSignUpRequest, { UserSignUpRequestDto } from "../../../../business/users/signUp/UserSignUpRequest";
import { EnviromentConfiguration, enviromentConfiguration } from "../../../../enviromentConfiguration";

export {
  UserSignUpController,
  UserSignUpControllerRequest
}

class UserSignUpController {

  readonly command: UserSignUp;
  readonly apiResponseBuilder: ApiResponseBuilder;
  readonly enviromentConfiguration: EnviromentConfiguration;

  constructor(
    command: UserSignUp,
    apiResponseBuilder: ApiResponseBuilder,
    enviromentConfiguration: EnviromentConfiguration
  ){
      this.command = command;
      this.apiResponseBuilder = apiResponseBuilder;
      this.enviromentConfiguration = enviromentConfiguration;
  }

  async signUp(request: UserSignUpControllerRequest){
    const commandRequest = this.buildCommandRequest(request);
    if(commandRequest.isFail()){
      const validationErrors = commandRequest.getFails();
      this.apiResponseBuilder.sendValidationErrorResponse(validationErrors);
    }
    const result = await this.command.signUp(commandRequest.getSuccess());
    if(result.isLeft()){
      const commandError = result.getLeft();
      this.apiResponseBuilder.sendCommandErrorResponse(commandError.toString());
    }
    const user = result.getRight();
    const sessionToken = jwt.sign({ userId: user.id }, enviromentConfiguration.JWT_SECRET_KEY, { expiresIn: '7d' });
    const response = new ResponseDto(sessionToken);
    this.apiResponseBuilder.sendSuccessResponse(response);
  }

  private buildCommandRequest(request: UserSignUpControllerRequest){
      const commandRequestDto = new UserSignUpRequestDto(
        request.email,
        request.name,
        request.surname,
        request.password,
        request.areLegalTermsAndConditionsAccepted
      );
      return UserSignUpRequest.create(commandRequestDto);
  }
}

class UserSignUpControllerRequest {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly surname: string;
  readonly areLegalTermsAndConditionsAccepted: boolean;

  constructor(
    email: string,
    password: string,
    name: string,
    surname: string,
    areLegalTermsAndConditionsAccepted: boolean
  ) {
     this.email = email;
     this.password = password;
     this.name = name;
     this.surname = surname;
     this.areLegalTermsAndConditionsAccepted = areLegalTermsAndConditionsAccepted;
  }
}

class ResponseDto {
  token: string;

  constructor(token: string){
    this.token = token;
  }
}