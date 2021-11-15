import { mock, MockProxy } from 'jest-mock-extended'
import { match } from 'fp-ts/Either'
import { some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../../../../business/projects/projectRepository'

import buildProject from '../../builders/projects/projectBuilder'
import { UpdateProject } from '../../../../business/projects/update/updateProject'
import { ProjectUpdatingRequest, ProjectUpdatingRequestDto } from '../../../../business/projects/update/ProjectUpdatingRequest'


describe('Update Project', () => {
  let projectRepository: MockProxy<ProjectRepository>
  let command: UpdateProject

  beforeEach(() => {
    projectRepository = mock<ProjectRepository>()
    command = new UpdateProject(projectRepository)
  })

  it('updated project', async () => {
    const request = <ProjectUpdatingRequest>buildRequest({name: "MundoManitas.com"})
    const project = buildProject({name: 'Xataka.com'})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(some(project))

    await command.update(request)

    expect(projectRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: project.id,
        userId: project.userId,
        name: request.name,
        created_at: project.created_at
      })
    )
  })

  it('does not update project when it not found', async () => {
    const request = <ProjectUpdatingRequest>buildRequest({})
    projectRepository.searchBy
      .calledWith(request.projectId, request.userId)
      .mockResolvedValue(none)

    await command.update(request)

    expect(projectRepository.update).not.toHaveBeenCalled()
  })

    interface RequestBuilderParams {
        name?: string;
    }

    function buildRequest ({
      name = 'Xataka.com'
    }: RequestBuilderParams): ProjectUpdatingRequest | null {
      const requestDto = new ProjectUpdatingRequestDto(
        '211376cc-54f0-4991-ab50-a1f2cc35a291',
        'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
        name
      )
      return pipe(
        ProjectUpdatingRequest.create(requestDto),
        match(
          _ => null,
          request => request
        )
      )
    }
})
