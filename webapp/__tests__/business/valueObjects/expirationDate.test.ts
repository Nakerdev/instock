import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ExpirationDate } from '../../../business/valueObjects/expirationDate'
import { ValidationError } from '../../../business/types/validationError'

describe('Expiration date', () => {
  it('creates expiration date', () => {
    const result = ExpirationDate.create('2021-10-10')

    expect(isRight(result)).toBeTruthy()
  })

  const validationTestCases: ValidationTestCase[] = [
    {
      name: 'does not create expiration date when the value is empty',
      value: '',
      expectedError: ValidationError.Required
    },
    {
      name: 'does not create expiration date when is not valid date',
      value: 'not-valid-date',
      expectedError: ValidationError.InvalidFormat
    }
  ]

  validationTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = ExpirationDate.create(testCase.value)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          error => expect(error).toBe(testCase.expectedError),
          _ => expect(true).toBeFalsy()
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
