import { Project } from './project'
import { Name } from '../valueObjects/name'
import { UserId } from '../valueObjects/userId'

export default interface ProjectRepository {
    save(project: Project): Promise<void>;
    exist(name: Name, userId: UserId): Promise<boolean>;
}
