import { Either, left, right } from 'fp-ts/Either'

import PasswordHashingService from '../../security/cryptography/passwordHashingService'
import UuidService from '../../security/cryptography/uuidService'
import TimeService from '../../infraestructure/timeService'
import UserRepository from '../userRepository'
import { User } from '../user'
import { UserSignUpRequest } from './UserSignUpRequest'
import { UserId } from '../../valueObjects/userId'

export { UserSignUp, UserSignUpError }

enum UserSignUpError {
  UserAlreadyExist = 'UserAlreadyExist'
}

class UserSignUp {
  readonly userRepository: UserRepository
  readonly passwordHashingService: PasswordHashingService
  readonly uuidService: UuidService
  readonly timeService: TimeService

  constructor (
    userRepository: UserRepository,
    passwordHashingService: PasswordHashingService,
    uuidService: UuidService,
    timeService: TimeService
  ) {
    this.userRepository = userRepository
    this.passwordHashingService = passwordHashingService
    this.uuidService = uuidService
    this.timeService = timeService
  }

  async signUp (
    request: UserSignUpRequest
  ): Promise<Either<UserSignUpError, User>> {
    const userAlreadyExist = await this.userRepository.exist(request.email)
    if (userAlreadyExist) {
      return left(UserSignUpError.UserAlreadyExist)
    }
    const user = await this.buildUser(request)
    await this.userRepository.save(user)
    return right(user)
  }

  private async buildUser (request: UserSignUpRequest): Promise<User> {
    const userId = UserId.newId(this.uuidService)
    const hashedPassword = await request.password.hash(
      this.passwordHashingService
    )
    const signUpDate = this.timeService.utcNow()
    return new User(
      userId,
      request.email,
      hashedPassword,
      request.name,
      request.surname,
      signUpDate
    )
  }
}
