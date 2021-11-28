import { ProjectId, ProjectIdPersistenceState } from '../valueObjects/projectId'
import { UserId, UserIdPersistenceState } from '../valueObjects/userId'
import { Name, NamePersistenceState } from '../valueObjects/name'

export {
  Project,
  ProjectPersistenceState
}

class Project {
  readonly id: ProjectId
  readonly userId: UserId
  readonly name: Name
  readonly created_at: Date

  readonly state: ProjectPersistenceState

  static createFromState (state: ProjectPersistenceState): Project {
    return new Project(
      ProjectId.createFromState(state.id),
      UserId.createFromState(state.userId),
      Name.createFromState(state.name),
      state.created_at
    )
  }

  constructor (
    projectId: ProjectId,
    userId: UserId,
    name: Name,
    created_at: Date
  ) {
    this.id = projectId
    this.userId = userId
    this.name = name
    this.created_at = created_at
    this.state = new ProjectPersistenceState(
      this.id.state,
      this.userId.state,
      this.name.state,
      this.created_at
    )
  }
}

class ProjectPersistenceState {
  readonly id: ProjectIdPersistenceState
  readonly userId: UserIdPersistenceState
  readonly name: NamePersistenceState
  readonly created_at: Date

  constructor (
    id: ProjectIdPersistenceState,
    userId: UserIdPersistenceState,
    name: NamePersistenceState,
    created_at: Date
  ) {
    this.id = id
    this.userId = userId
    this.name = name
    this.created_at = created_at
  }
}
