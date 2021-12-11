import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { Surname } from '../../../business/valueObjects/surname'
import { ValidationError } from '../../../business/types/validationError'

describe('Surname', () => {
  it('creates surname', () => {
    const result = Surname.create('Gonzalez')

    expect(isRight(result)).toBeTruthy()
  })

  const validationTestCases: ValidationTestCase[] = [
    {
      name: 'does not create surname when the value is empty',
      value: '',
      expectedError: ValidationError.Required
    },
    {
      name: 'does not create surname when the length is too long',
      value: 'a'.repeat(255),
      expectedError: ValidationError.WrongLength
    }
  ]

  validationTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = Surname.create(testCase.value)

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
    expectedError: ValidationError
}
