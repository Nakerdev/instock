import { isLeft, isRight, match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import { UserId } from '../../../../../business/valueObjects/userId'
import { ValidationError } from '../../../../../business/types/validationError'
import { ProjectBulkDeletionRequestDto, ProjectBulkDeletionRequest } from '../../../../../business/projects/delete/bulk/ProjectBulkDeletionRequest'
import { ProjectId } from '../../../../../business/valueObjects/projectId'

describe('Project Bulk Deletion Request', () => {
  it('creates request', () => {
    const requestDto = buildRequestDto({})

    const result = ProjectBulkDeletionRequest.create(requestDto)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        request => {
          const expectedUserId = UserId.create(requestDto.userId)
          const expectedProjectsId = requestDto.projectsId
            .map(x => ProjectId.create(x))
            .map(x => {
              if (isLeft(x)) throw new Error('invalid object state')
              return x.right
            })
          expect(request).toEqual({
            userId: isRight(expectedUserId) ? expectedUserId.right : null,
            projectsId: expectedProjectsId
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
      name: 'does not create request when projects id are empty',
      requestDto: buildRequestDto({ projectsId: [] }),
      expectedFieldId: 'projectsId',
      expectedError: ValidationError.Required
    },
    {
      name: 'does not create request when some of projects id has validaion errors',
      requestDto: buildRequestDto({ projectsId: ['not-valid-id'] }),
      expectedFieldId: 'projectsId[0]',
      expectedError: ValidationError.InvalidFormat
    }
  ]

  validationErrorTestCases.forEach(testCase => {
    it(testCase.name, () => {
      const result = ProjectBulkDeletionRequest.create(testCase.requestDto)

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
          _ => expect(true).toBeFalsy()
        )
      )
    })
  })

    interface requestDtoBuilderParams {
        userId?: string,
        projectsId?: string[]
    }

    function buildRequestDto ({
      userId = 'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      projectsId = ['4b149208-44bf-11ec-81d3-0242ac130003']
    }: requestDtoBuilderParams): ProjectBulkDeletionRequestDto {
      return new ProjectBulkDeletionRequestDto(
        userId,
        projectsId
      )
    }
})

interface ValidationErrorTestCase {
    name: string,
    requestDto: ProjectBulkDeletionRequestDto,
    expectedFieldId: string,
    expectedError?: ValidationError
}
