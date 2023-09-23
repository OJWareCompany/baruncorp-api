/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobMapper } from '../../job.mapper'
import { JobResponseDto } from '../../dtos/job.response.dto'

export class FindJobQuery {
  readonly jobId: string
  constructor(props: FindJobQuery) {
    this.jobId = props.jobId
  }
}

@QueryHandler(FindJobQuery)
export class FindJobQueryHandler implements IQueryHandler {
  constructor(
    // @ts-ignore
    @Inject(JOB_REPOSITORY) private readonly jobRepository: JobRepositoryPort,
    private readonly jobMapper: JobMapper,
  ) {}

  async execute(query: FindJobQuery): Promise<JobResponseDto> {
    const job = await this.jobRepository.findJobOrThrow(query.jobId)
    return this.jobMapper.toResponse(job)
  }
}
