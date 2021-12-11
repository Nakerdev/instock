import { mock, MockProxy } from 'jest-mock-extended'
import { isSome, isNone, some, none, match } from 'fp-ts/Option'
import { match as eitherMatch } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserPasswordRecoveryRequest, UserPasswordRecoveryRequestDto } from '../../../../business/users/passwordRecovery/UserPasswordRecoveryRequest'
import TimeService from '../../../../business/infraestructure/timeService'
import UserRepository from '../../../../business/users/userRepository'
import { UserPasswordRecovery, UserPasswordRecoveryError } from '../../../../business/users/passwordRecovery/userPasswordRecovery'
import UserPasswordRecoveryEmailSender from '../../../../business/notifications/emails/userPasswordRecoveryEmailSender'
import buildUser from '../../builders/users/userBuilder'
import { ExpirationDate } from '../../../../business/valueObjects/expirationDate'

describe('User Password Recovery', () => {
  let userRepository: MockProxy<UserRepository>
  let timeService: MockProxy<TimeService>
  let userPasswordRecoveryEmailSender: MockProxy<UserPasswordRecoveryEmailSender>
  let command: UserPasswordRecovery

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    timeService = mock<TimeService>()
    userPasswordRecoveryEmailSender = mock<UserPasswordRecoveryEmailSender>()
    command = new UserPasswordRecovery(
      userRepository,
      timeService,
      userPasswordRecoveryEmailSender
    )
  })

  it('sends password recovery email to user', async () => {
    const request = <UserPasswordRecoveryRequest>buildRequest()
    const user = buildUser({})
    userRepository.searchByEmail
      .calledWith(request.email)
      .mockResolvedValue(some(user))
    const utcNow = new Date(2021, 10, 10, 23, 0, 0, 0)
    timeService.utcNow
      .mockReturnValue(utcNow)

    const result = await command.recovery(request)

    expect(isNone(result)).toBeTruthy()
    const expectedExpirationDate = new ExpirationDate(new Date(2021, 10, 11, 23, 0, 0, 0))
    expect(userPasswordRecoveryEmailSender.send).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        passwordChangePetitionExpirationDate: expectedExpirationDate
      })
    )
  })

  it('does not signup user when user not found', async () => {
    const request = <UserPasswordRecoveryRequest>buildRequest()
    userRepository.searchByEmail
      .mockResolvedValue(none)

    const result = await command.recovery(request)

    expect(isSome(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        error => expect(error).toBe(UserPasswordRecoveryError.UserNotFound)
      )
    )
    expect(userPasswordRecoveryEmailSender.send).not.toHaveBeenCalled()
  })

  function buildRequest (): UserPasswordRecoveryRequest | null {
    const requestDto = new UserPasswordRecoveryRequestDto(
      'user@email.com'
    )
    return pipe(
      UserPasswordRecoveryRequest.create(requestDto),
      eitherMatch(
        () => null,
        request => request
      )
    )
  }
})
