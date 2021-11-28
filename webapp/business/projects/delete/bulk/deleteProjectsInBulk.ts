import ProjectRepository from '../../projectRepository'

import { ProjectBulkDeletionRequest } from './ProjectBulkDeletionRequest'

export class DeleteProjectsInBulk {
  readonly projectRepository: ProjectRepository

  constructor (
    projectRepository: ProjectRepository
  ) {
    this.projectRepository = projectRepository
  }

  async delete (
    request: ProjectBulkDeletionRequest
  ): Promise<void> {
    await this.projectRepository.deleteAll(request.projectsId, request.userId)
  }
}
