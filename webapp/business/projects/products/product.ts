import { ProjectId, ProjectIdPersistenceState } from '../valueObjects/projectId'
import { UserId, UserIdPersistenceState } from '../valueObjects/userId'
import { ProductId, ProductIdPersistenceState } from '../valueObjects/productId'

export {
  Product,
  ProductPersistenceState
}

class Product {
  readonly id: ProductId
  readonly projectId: ProjectId
  readonly userId: UserId
  readonly created_at: Date

  readonly state: ProductPersistenceState

  static createFromState (state: ProductPersistenceState): Project {
      return new Project(
        ProductId.createFromState(state.id),
        ProjectId.createFromState(state.projectId),
        UserId.createFromState(state.userId),
        state.created_at
      )
  }

    constructor (
        id: ProductId,
        projectId: ProjectId,
        userId: UserId,
        created_at: Date
  ) {
    this.id = id
    this.projectId = projectId
    this.userId = userId
    this.created_at = created_at 
    this.state = new ProductPersistenceState(
      this.id.state,
      this.projectId.state,
      this.userId.state,
      this.created_at
    )
  }
}

class ProductPersistenceState {
  readonly id: ProducttIdPersistenceState
  readonly projectId: ProjectIdPersistenceState
  readonly userId: UserIdPersistenceState
  readonly created_at: Date

  constructor (
    id: ProductIdPersistenceState,
    projectId: ProjectIdPersistenceState,
    userId: UserIdPersistenceState,
    created_at: Date
  ) {
    this.id = id
    this.projectId = projectId
    this.userId = userId
    this.created_at = created_at 
  }
}
