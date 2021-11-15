import { match } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'

import ProjectRepository from '../projectRepository'

import { Project } from '../project'
import { ProjectUpdatingRequest } from './ProjectUpdatingRequest'

export class UpdateProject {
  readonly projectRepository: ProjectRepository

  constructor (
    projectRepository: ProjectRepository,
  ) {
    this.projectRepository = projectRepository
  }

  async update (request: ProjectUpdatingRequest): Promise<void> {
    pipe(
      await this.projectRepository.searchBy(request.projectId, request.userId),
      match(
        () => {},
        (project: Project) => this.updateProject(project, request)
      )
    )
  }

  private async updateProject(project: Project, request: ProjectUpdatingRequest) {
    const newProject = new Project(
      project.id, 
      project.userId, 
      request.name, 
      project.created_at
    )
    await this.projectRepository.update(newProject)
  }
}
