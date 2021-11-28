import { PrismaClient } from '@prisma/client'

import DbProductModel from '../../../prisma/models/projects/products/product'
import { UserId, UserIdPersistenceState } from '../../../business/valueObjects/userId'
import { ProjectId, ProjectIdPersistenceState } from '../../../business/valueObjects/projectId'
import ProductRepository from '../../../business/projects/products/productRepository'
import { Product, ProductPersistenceState } from '../../../business/projects/products/product'
import { ProductId, ProductIdPersistenceState } from '../../../business/valueObjects/productId'

export default class ProductPrismaRepository implements ProductRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async searchAll (userId: UserId, projectId: ProjectId): Promise<Product[]> {
    try {
      await this.prisma.$connect()
      const dbModels: DbProductModel[] = await this.prisma.products.findMany({
        where: {
          userId: userId.state.value,
          projectId: projectId.state.value
        }
      })
      const products = dbModels.map(model => this.buildProduct(model))
      return products
    } finally {
      this.prisma.$disconnect()
    }
  }

  async saveAll (products: Product[]): Promise<void> {
    try {
      await this.prisma.$connect()
      const dbEntities = products.map(p => this.buildDbEntity(p))
      await this.prisma.products.createMany({
        data: [dbEntities],
        skipDuplicated: true
      })
    } finally {
      this.prisma.$disconnect()
    }
  }

  async deleteAll (userId: UserId, projectId: ProjectId, productsId: ProductId[]): Promise<void> {
    try {
      await this.prisma.$connect()
      await this.prisma.products.deleteMany({
        where: {
          id: { in: productsId.map(x => x.state.value) },
          userId: userId.state.value,
          projectId: projectId.state.value
        }
      })
    } finally {
      this.prisma.$disconnect()
    }
  }

  private buildProduct (dbModel: DbProductModel): Product {
    const userState = new ProductPersistenceState(
      new ProductIdPersistenceState(dbModel.id),
      new ProjectIdPersistenceState(dbModel.id),
      new UserIdPersistenceState(dbModel.userId),
      dbModel.created_at
    )
    return Product.createFromState(userState)
  }

  private buildDbEntity (product: Product): DbProductModel {
    const state = product.state
    const dbEntity: DbProductModel = {
      id: state.id.value,
      userId: state.userId.value,
      projectId: state.projectId.value,
      created_at: state.created_at
    }
    return dbEntity
  }
}
