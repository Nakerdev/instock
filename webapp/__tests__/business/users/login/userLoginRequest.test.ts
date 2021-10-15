import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserLoginRequest, UserLoginRequestDto } from '../../../../business/users/login/UserLoginRequest'
import { Email } from '../../../../business/valueObjects/email'
import { Password } from '../../../../business/valueObjects/password'

describe('User Login Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = UserLoginRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        request => {
          const expectedEmail = Email.create(requestDto.email)
          const expectedPassword = Password.create(requestDto.password)
          expect(request).toEqual({
            email: isRight(expectedEmail) ? expectedEmail.right : null,
            password: isRight(expectedPassword) ? expectedPassword.right : null
          })
        }
      )
    )
  })

  const validationErrorTestCases: ValidationErrorTestCase[] = [
    {
      name: 'does not create request when email has validaiton errors',
      requestDto: buildRequestDto({ email: '' }),
      expectedFieldId: 'email'
    },
    {
      name: 'does not create request when password has validaiton errors',
      requestDto: buildRequestDto({ password: '' }),
      expectedFieldId: 'password'
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = UserLoginRequest.create(testCase.requestDto)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          errors => {
            expect(errors.length).toBe(1)
            expect(errors[0].fieldId).toBe(testCase.expectedFieldId)
          },
          _ => expect(true).toBeFalsy()
        )
      )
    })
  })

    interface requestDtoBuilderParams {
        email?: string,
        password?: string
    }

    function buildRequestDto ({
      email = 'user@email.com',
      password = 'MyStr0ngPass*'
    }: requestDtoBuilderParams): UserLoginRequestDto {
      return new UserLoginRequestDto(
        email,
        password
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: UserLoginRequestDto,
    expectedFieldId: string
}
