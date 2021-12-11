import { Product } from './product'
import { UserId } from '../../valueObjects/userId'
import { ProjectId } from '../../valueObjects/projectId'
import { ProductId } from '../../valueObjects/productId'

export default interface ProductRepository {
    searchAll(userId: UserId, projectId: ProjectId): Promise<Product[]>;
    saveAll(products: Product[]): Promise<void>;
    deleteAll(userId: UserId, projectId: ProjectId, productsId: ProductId[]): Promise<void>;
    deleteAllProjectsProducts(userId: UserId, projectsId: ProjectId[]): Promise<void>;
}
