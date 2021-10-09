import { NextApiResponse } from "next";

import { nextApiResponseBuilder } from "./apiUtils";
import { UserSignUpController } from "./controller";
import { enviromentConfiguration } from "../../../../enviromentConfiguration";
import { UserSignUp } from "../../../../business/users/signUp/userSignUp";
import UserRepository from "../../../../business/users/userRepository";
import User from "../../../../business/users/user";
import Email from "../../../../business/valueObjects/email";
import SystemTimeService from "../../../../infraestructure/systemTimeService";
import BCryptPasswordHasingService from "../../../../infraestructure/security/cryptography/passwordHashingService";
import SystemUuidService from "../../../../infraestructure/security/cryptography/uuidService";

export function buildUserSignUpController(res: NextApiResponse): UserSignUpController {
  return new UserSignUpController(
    buildCommand(), 
    nextApiResponseBuilder(res), 
    enviromentConfiguration)

  function buildCommand(): UserSignUp {
    return new UserSignUp(
      new StaticUserRepository(),
      new BCryptPasswordHasingService(),
      new SystemUuidService(),
      new SystemTimeService());
  }
}

class StaticUserRepository implements UserRepository {

  save(user: User): void{
    return;
  }

  exist(email: Email): boolean {
    return true;
  }
}