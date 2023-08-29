import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobProps } from '../../domain/job.type'

export class FindJobQuery {
  readonly jobId: string
  constructor(props: FindJobQuery) {
    this.jobId = props.jobId
  }
}

@QueryHandler(FindJobQuery)
export class FindJobQueryHandler implements IQueryHandler {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort) {}

  async execute(query: FindJobQuery): Promise<JobProps> {
    const job = await this.jobRepository.findJob(query.jobId)

    return {
      ...job.getProps(),
    }
  }
}
