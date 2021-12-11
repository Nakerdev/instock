import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { Password } from '../../../business/valueObjects/password'
import { ValidationError } from '../../../business/types/validationError'

describe('Password', () => {
  it('creates password', () => {
    const result = Password.create('MyStr0ingPass*')

    expect(isRight(result)).toBeTruthy()
  })

  const validationTestCases: ValidationTestCase[] = [
    {
      name: 'does not create password when the value is empty',
      value: '',
      expectedError: ValidationError.Required
    },
    {
      name: 'does not create password when the length is too short',
      value: 'M1Pass*',
      expectedError: ValidationError.InvalidFormat
    },
    {
      name: 'does not create password when not includes at least one number',
      value: 'MyPassword*',
      expectedError: ValidationError.InvalidFormat
    },
    {
      name: 'does not create password when not includes at least one uppercase letter',
      value: 'mypassw0rd*',
      expectedError: ValidationError.InvalidFormat
    },
    {
      name: 'does not create password when not includes at least one non-char letter',
      value: 'mypassw0rd',
      expectedError: ValidationError.InvalidFormat
    },
    {
      name: 'does not password when the length is too long',
      value: 'a'.repeat(255) + 'C0*',
      expectedError: ValidationError.WrongLength
    }
  ]

  validationTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = Password.create(testCase.value)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          error => expect(error).toBe(testCase.expectedError),
          () => expect(true).toBeFalsy()
        )
      )
    })
  })
})

interface ValidationTestCase {
    name: string,
    value: string,
    expectedError: ValidationError,
}
