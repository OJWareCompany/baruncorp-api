import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepository } from '../../database/job.repository'
import { JobProps } from '../../domain/job.type'

export class FindJobQuery {
  readonly jobId: string
  constructor(props: FindJobQuery) {
    this.jobId = props.jobId
  }
}

@QueryHandler(FindJobQuery)
export class FindJobQueryHandler implements IQueryHandler {
  constructor(@Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepository) {}

  async execute(query: FindJobQuery): Promise<JobProps> {
    const job = await this.jobRepository.findJob(query.jobId)

    return {
      ...job.getProps(),
    }
  }
}
