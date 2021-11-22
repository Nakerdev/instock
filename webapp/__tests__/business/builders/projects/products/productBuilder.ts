import { Product } from '../../../../../business/projects/products/product'
import { UserId, UserIdPersistenceState } from '../../../../../business/valueObjects/userId'
import { ProjectId, ProjectIdPersistenceState } from '../../../../../business/valueObjects/projectId'
import { ProductId, ProductIdPersistenceState } from '../../../../../business/valueObjects/productId'

interface ProductBuilderParams {
    id?: string;
}

export default function buildProduct ({
  id = 'B08QW794WD'
}: ProductBuilderParams): Product {
  return new Product(
    ProductId.createFromState(new ProductIdPersistenceState(id)),
    ProjectId.createFromState(new ProjectIdPersistenceState('5f8e31d2-4a17-11ec-81d3-0242ac130003')),
    UserId.createFromState(new UserIdPersistenceState('deb74e35-ea5f-535f-890f-5779b5d8e27f')),
    new Date(2021, 10, 10)
  )
}
