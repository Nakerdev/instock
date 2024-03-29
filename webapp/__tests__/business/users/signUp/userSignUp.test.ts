import { mock, MockProxy } from 'jest-mock-extended'
import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserSignUp, UserSignUpError } from '../../../../business/users/signUp/userSignUp'
import { UserSignUpRequest, UserSignUpRequestDto } from '../../../../business/users/signUp/UserSignUpRequest'
import PasswordHashingService from '../../../../business/security/cryptography/passwordHashingService'
import UuidService from '../../../../business/security/cryptography/uuidService'
import TimeService from '../../../../business/infraestructure/timeService'
import UserRepository from '../../../../business/users/userRepository'
import { UserId } from '../../../../business/valueObjects/userId'

describe('User SignUp', () => {
  let userRepository: MockProxy<UserRepository>
  let passwordHasingService: MockProxy<PasswordHashingService>
  let uuidService: MockProxy<UuidService>
  let timeService: MockProxy<TimeService>
  let command: UserSignUp

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    passwordHasingService = mock<PasswordHashingService>()
    uuidService = mock<UuidService>()
    timeService = mock<TimeService>()
    command = new UserSignUp(
      userRepository,
      passwordHasingService,
      uuidService,
      timeService
    )
  })

  it('signs up user', async () => {
    const password = 'MyStr0ngPass!'
    const request = <UserSignUpRequest>buildRequest({ password })
    const uuid = 'deb74e35-ea5f-535f-890f-5779b5d8e27f'
    uuidService.create
      .mockReturnValue(uuid)
    const hashedPassword = '$2a$12$pBJwF27FLEY1RQSh428lX.1hwwh9uHdgGyM7il6C/cVa2/wbAdzKC'
    passwordHasingService.hash
      .calledWith(password)
      .mockResolvedValue(hashedPassword)
    const utcNow = new Date(2021, 10, 10)
    timeService.utcNow
      .mockReturnValue(utcNow)

    const result = await command.signUp(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        createdUser => expect(createdUser.id.state.value).toBe(uuid)
      )
    )
    const expectedUserId = UserId.newId(uuidService)
    const expectedPassword = await request.password.hash(passwordHasingService)
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedUserId,
        email: request.email,
        name: request.name,
        surname: request.surname,
        password: expectedPassword,
        signUpDate: utcNow
      })
    )
  })

  it('does not signup user when user with the same email already exist', async () => {
    const request = <UserSignUpRequest>buildRequest({})
    userRepository.exist
      .calledWith(request.email)
      .mockResolvedValue(true)

    const result = await command.signUp(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(UserSignUpError.UserAlreadyExist),
        () => expect(true).toBeFalsy()
      )
    )
    expect(userRepository.save).not.toHaveBeenCalled()
  })

    interface RequestBuilderParams {
        password?: string;
    }

    function buildRequest ({
      password = 'MyStr0ngPass*'
    }: RequestBuilderParams): UserSignUpRequest | null {
      const requestDto = new UserSignUpRequestDto(
        'user@email.com',
        'Alvaro',
        'Gonzalez',
        password,
        'true'
      )
      return pipe(
        UserSignUpRequest.create(requestDto),
        match(
          () => null,
          request => request
        )
      )
    }
})
