import { Product } from './product'
import { UserId } from '../../valueObjects/userId'
import { ProjectId } from '../../valueObjects/projectId'

export default interface ProductRepository {
    searchAll(projectId: ProjectId, userId: UserId): Promise<Product[]>;
    saveAll(products: Product[]): Promise<void>;
}
