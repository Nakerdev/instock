import { mock, MockProxy } from 'jest-mock-extended'
import { isSome, isNone, some, none, match } from 'fp-ts/Option'
import { match as eitherMatch } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ChangeUserPassword, ChangeUserPasswordError } from '../../../../business/users/changePassword/changeUserPassword'
import { UserChangePasswordRequest, UserChangePasswordRequestDto } from '../../../../business/users/changePassword/UserChangePasswordRequest'
import TimeService from '../../../../business/infraestructure/timeService'
import UserRepository from '../../../../business/users/userRepository'
import buildUser from '../../builders/users/userBuilder'
import PasswordHasingService from '../../../../business/security/cryptography/passwordHashingService'

describe('Change User Password', () => {
  let userRepository: MockProxy<UserRepository>
  let passwordHashingService: MockProxy<PasswordHasingService>
  let timeService: MockProxy<TimeService>
  let command: ChangeUserPassword

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    passwordHashingService = mock<PasswordHasingService>()
    timeService = mock<TimeService>()
    command = new ChangeUserPassword(
      userRepository,
      passwordHashingService,
      timeService
    )
  })

  it('changes user password', async () => {
    const password = 'MyNewPass0rd!'
    const request = <UserChangePasswordRequest>buildRequest({
      password: password,
      passwordChangePetitionExpirationDate: '2021-10-11T23:00:00Z'
    })
    const user = buildUser({})
    userRepository.searchById
      .calledWith(request.userId)
      .mockResolvedValue(some(user))
    const utcNow = new Date(2021, 9, 10, 23, 0, 0)
    timeService.utcNow
      .mockReturnValue(utcNow)
    const hashedPassword = '$2a$12$pBJwF27FLEY1RQSh428lX.1hwwh9uHdgGyM7il6C/cVa2/wbAdzKC'
    passwordHashingService.hash
      .calledWith(password)
      .mockResolvedValue(hashedPassword)

    const result = await command.change(request)

    expect(isNone(result)).toBeTruthy()
    const expectedPassword = await request.password.hash(passwordHashingService)
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        password: expectedPassword,
        name: user.name,
        surname: user.surname,
        signUpDate: user.signUpDate
      })
    )
  })

  it('does not change user password when petition expiration date is expired', async () => {
    const request = <UserChangePasswordRequest>buildRequest({
      passwordChangePetitionExpirationDate: '2021-10-10T23:00:00Z'
    })
    const user = buildUser({})
    userRepository.searchById
      .mockResolvedValue(some(user))
    const utcNow = new Date(2021, 9, 11, 23, 0, 0)
    timeService.utcNow
      .mockReturnValue(utcNow)

    const result = await command.change(request)

    expect(isSome(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        error => expect(error).toBe(ChangeUserPasswordError.PasswordChangePetitionExpired)
      )
    )
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('does not change user password when user not found', async () => {
    const request = <UserChangePasswordRequest>buildRequest({})
    userRepository.searchById
      .mockResolvedValue(none)

    const result = await command.change(request)

    expect(isSome(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        error => expect(error).toBe(ChangeUserPasswordError.UserNotFound)
      )
    )
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  interface RequestBuilderParams {
    password?: string;
    passwordChangePetitionExpirationDate?: string;
  }

  function buildRequest ({
    password = 'MyNewPass0rd!',
    passwordChangePetitionExpirationDate = '2021-10-10T23:00:00Z'
  }: RequestBuilderParams): UserChangePasswordRequest | null {
    const requestDto = new UserChangePasswordRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      password,
      passwordChangePetitionExpirationDate
    )
    return pipe(
      UserChangePasswordRequest.create(requestDto),
      eitherMatch(
        _ => null,
        request => request
      )
    )
  }
})
