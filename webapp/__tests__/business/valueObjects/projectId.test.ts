import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ProjectId } from '../../../business/valueObjects/projectId'
import { ValidationError } from '../../../business/types/validationError'

describe('ProjectId', () => {
  it('creates project id', () => {
    const result = ProjectId.create('a0b1dd5a-2e63-11ec-8d3d-0242ac130003')

    expect(isRight(result)).toBeTruthy()
  })

  const validationTestCases: ValidationTestCase[] = [
    {
      name: 'does not create project id when the value is empty',
      value: '',
      expectedError: ValidationError.Required
    },
    {
      name: 'does not create project id when the format is not valid',
      value: 'not-valid-uuid',
      expectedError: ValidationError.InvalidFormat
    }
  ]

  validationTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = ProjectId.create(testCase.value)

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
