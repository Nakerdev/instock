import { Project } from './project'
import { Name } from '../valueObjects/name'
import { UserId } from '../valueObjects/userId'

export default interface ProjectRepository {
    save(project: Project): Promise<void>;
    exist(userId: UserId, name: Name): Promise<boolean>;
}
