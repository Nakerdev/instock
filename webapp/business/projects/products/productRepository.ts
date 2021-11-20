import { Product } from './product'
import { UserId } from '../valueObjects/userId'
import { ProjectId } from '../valueObjects/projectId'

export default interface ProjectRepository {
    searchAll(projectId: ProjectId, userId: UserId): Promise<Product[]>;
}
