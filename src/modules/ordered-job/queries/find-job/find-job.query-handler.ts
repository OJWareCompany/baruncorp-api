/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { JobResponseDto } from '../../dtos/job.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { JobNotFoundException } from '../../domain/job.error'
import { JobResponseMapper } from '../../job.response.mapper'

export class FindJobQuery {
  readonly jobId: string
  constructor(props: FindJobQuery) {
    this.jobId = props.jobId
  }
}

@QueryHandler(FindJobQuery)
export class FindJobQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobResponseMapper: JobResponseMapper) {}

  async execute(query: FindJobQuery): Promise<JobResponseDto> {
    const job = await this.prismaService.orderedJobs.findFirst({ where: { id: query.jobId } })
    if (!job) throw new JobNotFoundException()
    const result = await this.jobResponseMapper.toResponse(job)
    return result
  }
}
