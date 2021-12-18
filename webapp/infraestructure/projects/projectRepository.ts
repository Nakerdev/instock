import { Option, none, some } from 'fp-ts/lib/Option'
import { PrismaClient } from '@prisma/client'

import DbProjectModel from '../../prisma/models/projects/project'
import { UserId, UserIdPersistenceState } from '../../business/valueObjects/userId'
import { Name, NamePersistenceState } from '../../business/valueObjects/name'
import ProjectRepository from '../../business/projects/projectRepository'
import { Project, ProjectPersistenceState } from '../../business/projects/project'
import { ProjectId, ProjectIdPersistenceState } from '../../business/valueObjects/projectId'

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

  async deleteAll (userId: UserId, projectsId: ProjectId[]): Promise<void> {
    try {
      await this.prisma.$connect()
      await this.prisma.projects.deleteMany({
        where: {
          id: { in: projectsId.map(x => x.state.value) },
          userId: userId.state.value
        }
      })
    } finally {
      this.prisma.$disconnect()
    }
  }

  async searchBy (userId: UserId, projectId: ProjectId): Promise<Option<Project>> {
    try {
      await this.prisma.$connect()
      const dbModel: DbProjectModel | null = await this.prisma.projects.findFirst({
        where: {
          id: projectId.state.value,
          userId: userId.state.value
        }
      })
      if (dbModel === null) return none
      return some(this.buildProject(dbModel))
    } finally {
      this.prisma.$disconnect()
    }
  }

  async update (project: Project): Promise<void> {
    try {
      await this.prisma.$connect()
      await this.prisma.projects.update({
        where: {
          id: project.id.state.value
        },
        data: {
          name: project.name.state.value
        }
      })
    } finally {
      this.prisma.$disconnect()
    }
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
