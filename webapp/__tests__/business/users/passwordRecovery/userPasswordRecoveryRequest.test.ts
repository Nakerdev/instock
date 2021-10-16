import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserPasswordRecoveryRequest, UserPasswordRecoveryRequestDto } from '../../../../business/users/passwordRecovery/UserPasswordRecoveryRequest'
import { Email } from '../../../../business/valueObjects/email'

describe('User Password Recovery Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = UserPasswordRecoveryRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        request => {
          const expectedEmail = Email.create(requestDto.email)
          expect(request).toEqual({
            email: isRight(expectedEmail) ? expectedEmail.right : null
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
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = UserPasswordRecoveryRequest.create(testCase.requestDto)

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
        email?: string
    }

    function buildRequestDto ({
      email = 'user@email.com',
    }: requestDtoBuilderParams): UserPasswordRecoveryRequestDto {
      return new UserPasswordRecoveryRequestDto(
        email
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: UserPasswordRecoveryRequestDto,
    expectedFieldId: string
}
