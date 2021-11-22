import {Option, none, some} from 'fp-ts/lib/Option'
import { PrismaClient } from '@prisma/client'

import DbProjectModel from '../../../prisma/models/projects/project'
import { UserId, UserIdPersistenceState } from '../../business/valueObjects/userId'
import { Name, NamePersistenceState } from '../../../business/valueObjects/name'
import { Project, ProjectPersistenceState } from '../../../business/projects/project'
import { ProjectId, ProjectIdPersistenceState } from '../../../business/valueObjects/projectId'
import ProductRepository from '../../../business/projects/products/productRepository'

export default class ProductPrismaRepository implements ProductRepository {

  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  searchAll(userId: import("../../../business/valueObjects/userId").UserId, projectId: import("../../../business/valueObjects/projectId").ProjectId): Promise<import("../../../business/projects/products/product").Product[]> {
    throw new Error("Method not implemented.")
  }
  saveAll(products: import("../../../business/projects/products/product").Product[]): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteAll(userId: import("../../../business/valueObjects/userId").UserId, projectId: import("../../../business/valueObjects/projectId").ProjectId, productsId: import("../../../business/valueObjects/productId").ProductId[]): Promise<void> {
    throw new Error("Method not implemented.")
  }

  private buildProject (dbModel: DbProjectModel): Project {
    const userState = new ProjectPersistenceState(
      new ProjectIdPersistenceState(dbModel.id),
      new UserIdPersistenceState(dbModel.userId),
      new NamePersistenceState(dbModel.name),
      dbModel.created_at
    )
    return Project.createFromState(userState)
  }
}
