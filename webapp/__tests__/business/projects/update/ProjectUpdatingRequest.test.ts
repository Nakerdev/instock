import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../../../business/valueObjects/userId'
import { Name } from '../../../../business/valueObjects/name'
import { ValidationError } from '../../../../business/types/validationError'
import { ProjectUpdatingRequestDto, ProjectUpdatingRequest } from '../../../../business/projects/update/ProjectUpdatingRequest'
import { ProjectId } from '../../../../business/valueObjects/projectId'

describe('Project Updating Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = ProjectUpdatingRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        () => expect(true).toBeFalsy(),
        request => {
          const expectedProjectId = ProjectId.create(requestDto.projectId)
          const expectedUserId = UserId.create(requestDto.userId)
          const expectedName = Name.create(requestDto.name)
          expect(request).toEqual({
            projectId: isRight(expectedProjectId) ? expectedProjectId.right : null,
            userId: isRight(expectedUserId) ? expectedUserId.right : null,
            name: isRight(expectedName) ? expectedName.right : null
          })
        }
      )
    )
  })

  const validationErrorTestCases: ValidationErrorTestCase[] = [
    {
      name: 'does not create request when project id has validaiton errors',
      requestDto: buildRequestDto({ projectId: '' }),
      expectedFieldId: 'projectId'
    },
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
      const result = ProjectUpdatingRequest.create(testCase.requestDto)

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
        projectId?: string,
        userId?: string,
        name?: string
    }

    function buildRequestDto ({
      projectId = '211376cc-54f0-4991-ab50-a1f2cc35a291',
      userId = 'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      name = 'Xataka.com'
    }: requestDtoBuilderParams): ProjectUpdatingRequestDto {
      return new ProjectUpdatingRequestDto(
        projectId,
        userId,
        name
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: ProjectUpdatingRequestDto,
    expectedFieldId: string,
    expectedError?: ValidationError
}
