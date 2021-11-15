import { Project } from '../../../../business/projects/project'
import { UserId, UserIdPersistenceState } from '../../../../business/valueObjects/userId'
import { Name, NamePersistenceState } from '../../../../business/valueObjects/name'
import { ProjectId } from '../../../../business/valueObjects/projectId'

interface ProjectBuilderParams {
    name?: string;
}

export default function buildProject ({
  name = 'Xataka.com'
}: ProjectBuilderParams): Project {
  return new Project(
    ProjectId.createFromState(new UserIdPersistenceState('211376cc-54f0-4991-ab50-a1f2cc35a291')),
    UserId.createFromState(new UserIdPersistenceState('deb74e35-ea5f-535f-890f-5779b5d8e27f')),
    Name.createFromState(new NamePersistenceState(name)),
    new Date(2021, 10, 10)
  )
}
