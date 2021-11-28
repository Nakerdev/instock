import { mock, MockProxy } from 'jest-mock-extended'
import { isLeft, isRight, match } from 'fp-ts/Either'
import { some, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../../../../business/projects/projectRepository'
import UserRepository from '../../../../business/users/userRepository'
import UuidService from '../../../../business/security/cryptography/uuidService'
import TimeService from '../../../../business/infraestructure/timeService'

import { UserId } from '../../../../business/valueObjects/userId'
import { ProjectCreationRequest, ProjectCreationRequestDto } from '../../../../business/projects/create/ProjectCreationRequest'
import { CreateProject, ProjectCreationError } from '../../../../business/projects/create/createProject'
import buildUser from '../../builders/users/userBuilder'

describe('Create Project', () => {
  let projectRepository: MockProxy<ProjectRepository>
  let userRepository: MockProxy<UserRepository>
  let uuidService: MockProxy<UuidService>
  let timeService: MockProxy<TimeService>
  let command: CreateProject

  beforeEach(() => {
    projectRepository = mock<ProjectRepository>()
    userRepository = mock<UserRepository>()
    uuidService = mock<UuidService>()
    timeService = mock<TimeService>()
    command = new CreateProject(
      projectRepository,
      userRepository,
      uuidService,
      timeService
    )
  })

  it('creates project', async () => {
    const request = <ProjectCreationRequest>buildRequest()
    userRepository.searchById
      .calledWith(request.userId)
      .mockResolvedValue(some(buildUser({})))
    projectRepository.exist
      .calledWith(request.userId, request.name)
      .mockResolvedValue(false)
    const uuid = 'deb74e35-ea5f-535f-890f-5779b5d8e27f'
    uuidService.create
      .mockReturnValue(uuid)
    const utcNow = new Date(2021, 10, 10)
    timeService.utcNow
      .mockReturnValue(utcNow)

    const result = await command.create(request)

    expect(isRight(result)).toBeTruthy()
    pipe(
      result,
      match(
        _ => expect(true).toBeFalsy(),
        createdProject => expect(createdProject.id.state.value).toBe(uuid)
      )
    )
    const expectedUserId = UserId.newId(uuidService)
    expect(projectRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedUserId,
        userId: request.userId,
        name: request.name,
        created_at: utcNow
      })
    )
  })

  it('does not create project when project with the same name already exist', async () => {
    const request = <ProjectCreationRequest>buildRequest()
    userRepository.searchById
      .calledWith(request.userId)
      .mockResolvedValue(some(buildUser({})))
    projectRepository.exist
      .calledWith(request.userId, request.name)
      .mockResolvedValue(true)

    const result = await command.create(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(ProjectCreationError.ProjectWithTheSameNameAlreadyExist),
        _ => expect(true).toBeFalsy()
      )
    )
    expect(projectRepository.save).not.toHaveBeenCalled()
  })

  it('does not create project when user not found', async () => {
    const request = <ProjectCreationRequest>buildRequest()
    userRepository.searchById
      .calledWith(request.userId)
      .mockResolvedValue(none)

    const result = await command.create(request)

    expect(isLeft(result)).toBeTruthy()
    pipe(
      result,
      match(
        error => expect(error).toBe(ProjectCreationError.UserNotExist),
        _ => expect(true).toBeFalsy()
      )
    )
    expect(projectRepository.save).not.toHaveBeenCalled()
  })

  function buildRequest (): ProjectCreationRequest | null {
    const requestDto = new ProjectCreationRequestDto(
      'a0b1dd5a-2e63-11ec-8d3d-0242ac130003',
      'Xataka.com'
    )
    return pipe(
      ProjectCreationRequest.create(requestDto),
      match(
        _ => null,
        request => request
      )
    )
  }
})
