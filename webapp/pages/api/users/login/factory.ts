import { NextApiResponse } from "next";

import { nextApiResponseBuilder } from "../../utils/apiUtils";
import { UserLoginController } from "./controller";
import { enviromentConfiguration } from "../../../../enviromentConfiguration";
import UserPrismaRepository from "../../../../infraestructure/users/userRepository";
import BCryptPasswordHasingService from "../../../../infraestructure/security/cryptography/passwordHashingService";
import { UserLogin } from "../../../../business/users/login/userLogin";

export function buildUserLoginController(res: NextApiResponse): UserLoginController {
  return new UserLoginController(
    buildCommand(), 
    nextApiResponseBuilder(res), 
    enviromentConfiguration)

  function buildCommand(): UserLogin {
    return new UserLogin (
      new UserPrismaRepository(),
      new BCryptPasswordHasingService());
  }
}