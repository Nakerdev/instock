import { mock, MockProxy } from 'jest-mock-extended'
import { some, none } from 'fp-ts/Option'
import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import PasswordHashingService from '../../../../business/security/cryptography/passwordHashingService'
import UserRepository from '../../../../business/users/userRepository'
import { UserLogin, UserLoginError } from '../../../../business/users/login/userLogin'
import { UserLoginRequest, UserLoginRequestDto } from '../../../../business/users/login/UserLoginRequest'
import buildUser from '../../builders/users/userBuilder'

describe('User Login', () => {
  let userRepository: MockProxy<UserRepository>
  let passwordHasingService: MockProxy<PasswordHashingService>
  let command: UserLogin

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    passwordHasingService = mock<PasswordHashingService>()
    command = new UserLogin(
      userRepository,
      passwordHasingService
    )
  })

  it('logins user', async () => {
    const passwordIntent = 'UserPassw0rdIntent!'
    const request = <UserLoginRequest>buildRequest({ password: passwordIntent })
    const userHashedPassword = 'hashed-password'
    const user = buildUser({ password: userHashedPassword })
    userRepository.searchByEmail
      .calledWith(request.email)
      .mockResolvedValue(some(user))
    passwordHasingService.compare
      .calledWith(userHashedPassword, passwordIntent)
      .mockResolvedValue(true)

    const result = await command.login(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        loggedUser => expect(loggedUser).toBe(user)
      )
    )
  })

  it('does not login user when credentials are invalid', async () => {
    const request = <UserLoginRequest>buildRequest({})
    userRepository.searchByEmail
      .mockResolvedValue(some(buildUser({})))
    passwordHasingService.compare
      .mockResolvedValue(false)

    const result = await command.login(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(UserLoginError.InvalidCredentials),
        () => expect(true).toBeFalsy()
      )
    )
  })

  it('does not login user when user not found', async () => {
    const request = <UserLoginRequest>buildRequest({})
    userRepository.searchByEmail
      .mockResolvedValue(none)

    const result = await command.login(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(UserLoginError.UserNotFound),
        () => expect(true).toBeFalsy()
      )
    )
  })

    interface RequestBuilderParams {
        password?: string;
    }

    function buildRequest ({
      password = 'MyStr0ngPass*'
    }: RequestBuilderParams): UserLoginRequest | null {
      const requestDto = new UserLoginRequestDto(
        'user@email.com',
        password
      )
      return pipe(
        UserLoginRequest.create(requestDto),
        match(
          () => null,
          request => request
        )
      )
    }
})
