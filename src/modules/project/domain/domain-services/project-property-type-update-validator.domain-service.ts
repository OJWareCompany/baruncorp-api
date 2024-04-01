import { Inject } from '@nestjs/common'
import { ProjectEntity } from '../project.entity'
import { JOB_REPOSITORY } from '../../../ordered-job/job.di-token'
import { JobRepositoryPort } from '../../../ordered-job/database/job.repository.port'

export class ProjectPropertyTypeUpdateValidator {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepo: JobRepositoryPort) {}
  async canUpdate(project: ProjectEntity) {
    const jobs = await this.jobRepo.findManyBy({ projectId: project.id })
    if (jobs.length > 1) return false
    else if (jobs.length === 1) return true
  }
}
