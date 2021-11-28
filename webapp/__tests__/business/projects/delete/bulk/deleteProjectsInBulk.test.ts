import { mock, MockProxy } from 'jest-mock-extended'
import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../../../../../business/projects/projectRepository'

import { DeleteProjectsInBulk } from '../../../../../business/projects/delete/bulk/deleteProjectsInBulk'
import { ProjectBulkDeletionRequest, ProjectBulkDeletionRequestDto } from '../../../../../business/projects/delete/bulk/ProjectBulkDeletionRequest'

describe('Crete Project', () => {
  let projectRepository: MockProxy<ProjectRepository>
  let command: DeleteProjectsInBulk

  beforeEach(() => {
    projectRepository = mock<ProjectRepository>()
    command = new DeleteProjectsInBulk(
      projectRepository
    )
  })

  it('deletes project', async () => {
    const request = <ProjectBulkDeletionRequest>buildRequest()

    await command.delete(request)

    expect(projectRepository.deleteAll).toHaveBeenCalledWith(
      request.projectsId,
      request.userId
    )
  })

  function buildRequest (): ProjectBulkDeletionRequest | null {
    const requestDto = new ProjectBulkDeletionRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      ['4b149208-44bf-11ec-81d3-0242ac130003']
    )
    return pipe(
      ProjectBulkDeletionRequest.create(requestDto),
      match(
        _ => null,
        request => request
      )
    )
  }
})
