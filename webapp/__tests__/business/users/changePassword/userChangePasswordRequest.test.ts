import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserChangePasswordRequest, UserChangePasswordRequestDto } from '../../../../business/users/changePassword/UserChangePasswordRequest'
import { UserId } from '../../../../business/valueObjects/userId'
import { Password } from '../../../../business/valueObjects/password'
import { ExpirationDate } from '../../../../business/valueObjects/expirationDate'

describe('User Change Password Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = UserChangePasswordRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        request => {
          const expectedUserId = UserId.create(requestDto.userId)
          const expectedPassword = Password.create(requestDto.password)
          const expectedPasswordChangePetitionExpirationDate = ExpirationDate.create(requestDto.passwordChangePetitionExpirationDate)
          expect(request).toEqual({
            userId: isRight(expectedUserId) ? expectedUserId.right : null,
            password: isRight(expectedPassword) ? expectedPassword.right : null,
            passwordChangePetitionExpirationDate: isRight(expectedPasswordChangePetitionExpirationDate) ? expectedPasswordChangePetitionExpirationDate.right : null
          })
        }
      )
    )
  })

  const validationErrorTestCases: ValidationErrorTestCase[] = [
    {
      name: 'does not create request when user id has validaiton errors',
      requestDto: buildRequestDto({ userId: '' }),
      expectedFieldId: 'userId'
    },
    {
      name: 'does not create request when password has validaiton errors',
      requestDto: buildRequestDto({ password: '' }),
      expectedFieldId: 'password'
    },
    {
      name: 'does not create request when password change petition expiration date has validaiton errors',
      requestDto: buildRequestDto({ passwordChangePetitionExpirationDate: '' }),
      expectedFieldId: 'passwordChangePetitionExpirationDate'
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = UserChangePasswordRequest.create(testCase.requestDto)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          errors => {
            expect(errors.length).toBe(1)
            expect(errors[0].fieldId).toBe(testCase.expectedFieldId)
          },
          () => expect(true).toBeFalsy()
        )
      )
    })
  })

    interface requestDtoBuilderParams {
        userId?: string
        password?: string
        passwordChangePetitionExpirationDate?: string
    }

    function buildRequestDto ({
      userId = 'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      password = 'MyNewPassw0rd!',
      passwordChangePetitionExpirationDate = '2021-10-10'
    }: requestDtoBuilderParams): UserChangePasswordRequestDto {
      return new UserChangePasswordRequestDto(
        userId,
        password,
        passwordChangePetitionExpirationDate
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: UserChangePasswordRequestDto,
    expectedFieldId: string
}
