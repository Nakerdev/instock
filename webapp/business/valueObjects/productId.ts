import { Either, left, right } from 'fp-ts/Either'

import { ValidationError } from '../types/validationError'
import { isEmpty } from '../utils/stringUtils'

export {
  ProductId,
  ProductIdPersistenceState
}

class ProductId {
  private value: string

  readonly state: ProductIdPersistenceState

  static create (value: string): Either<ValidationError, ProductId> {
    if (isEmpty(value)) {
      return left(ValidationError.Required)
    }

    const productId = new ProductId(value)
    return right(productId)
  }

  static createFromState (state: ProductIdPersistenceState): ProductId {
    return new ProductId(state.value)
  }

  private constructor (value: string) {
    this.value = value
    this.state = new ProductIdPersistenceState(value)
  }

  equals (anotherId: ProductId): boolean {
    return anotherId.value === this.value
  }
}

class ProductIdPersistenceState {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }
}
