import { PrismaClient } from '@prisma/client'

import { UserId } from '../../business/valueObjects/userId'
import { Name } from '../../business/valueObjects/name'
import ProjectRepository from '../../business/projects/projectRepository'
import { Project } from '../../business/projects/project'

export default class ProjectPrismaRepository implements ProjectRepository {
  readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async save (project: Project): Promise<void> {
    try {
      await this.prisma.$connect()
      const projectState = project.state
      await this.prisma.projects.create({
        data: {
          id: projectState.id.value,
          userId: projectState.userId.value,
          name: projectState.name.value,
          created_at: projectState.created_at
        }
      })
    } finally {
      this.prisma.$disconnect()
    }
  }

  async exist (userId: UserId, name: Name): Promise<boolean> {
    try {
      await this.prisma.$connect()
      const project = await this.prisma.projects.findFirst({
        where: {
          userId: userId.state.value,
          name: name.state.value
        }
      })
      return project !== null
    } finally {
      this.prisma.$disconnect()
    }
  }
}
