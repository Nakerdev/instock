import { Option } from 'fp-ts/lib/Option'

import { Project } from './project'
import { Name } from '../valueObjects/name'
import { UserId } from '../valueObjects/userId'
import { ProjectId } from '../valueObjects/projectId'

export default interface ProjectRepository {
    save(project: Project): Promise<void>;
    exist(userId: UserId, name: Name): Promise<boolean>;
    deleteAll(userId: UserId, projectsId: ProjectId[]): Promise<void>;
    searchBy(userId: UserId, projectId: ProjectId): Promise<Option<Project>>;
    update(project: Project): Promise<void>;
}
