import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { ProjectCreationRequest, ProjectCreationRequestDto } from '../../../../business/projects/create/ProjectCreationRequest'
import { UserId } from '../../../../business/valueObjects/userId'
import { Name } from '../../../../business/valueObjects/name'
import { ValidationError } from '../../../../business/types/validationError'

describe('Project Creation Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = ProjectCreationRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        request => {
          const expectedUserId = UserId.create(requestDto.userId)
          const expectedName = Name.create(requestDto.name)
          expect(request).toEqual({
            userId: isRight(expectedUserId) ? expectedUserId.right : null,
            name: isRight(expectedName) ? expectedName.right : null
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
      name: 'does not create request when name has validaiton errors',
      requestDto: buildRequestDto({ name: '' }),
      expectedFieldId: 'name'
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = ProjectCreationRequest.create(testCase.requestDto)

      expect(isLeft(result)).toBeTruthy()
      pipe(
        result,
        match(
          errors => {
            expect(errors.length).toBe(1)
            expect(errors[0].fieldId).toBe(testCase.expectedFieldId)
            if (testCase.expectedError) {
              expect(errors[0].error).toBe(testCase.expectedError)
            }
          },
          () => expect(true).toBeFalsy()
        )
      )
    })
  })

    interface requestDtoBuilderParams {
        userId?: string,
        name?: string
    }

    function buildRequestDto ({
      userId = 'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      name = 'Xataka.com'
    }: requestDtoBuilderParams): ProjectCreationRequestDto {
      return new ProjectCreationRequestDto(
        userId,
        name
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: ProjectCreationRequestDto,
    expectedFieldId: string,
    expectedError?: ValidationError
}
