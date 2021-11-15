import { Option } from 'fp-ts/lib/Option'

import { Project } from './project'
import { Name } from '../valueObjects/name'
import { UserId } from '../valueObjects/userId'
import { ProjectId } from '../valueObjects/projectId'

export default interface ProjectRepository {
    save(project: Project): Promise<void>;
    exist(userId: UserId, name: Name): Promise<boolean>;
    deleteAll(projectsId: ProjectId[], userId: UserId): Promise<void>;
    searchBy(projectId: ProjectId, userId: UserId): Promise<Option<Project>>;
    update(project: Project): Promise<void>;
}
