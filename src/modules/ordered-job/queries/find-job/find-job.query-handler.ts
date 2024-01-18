/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { JOB_REPOSITORY } from '../../job.di-token'
import { JobRepositoryPort } from '../../database/job.repository.port'
import { JobMapper } from '../../job.mapper'
import { JobResponseDto } from '../../dtos/job.response.dto'
import { PrismaService } from '../../../database/prisma.service'
import { GoogleDriveJobFolderNotFoundException } from '../../../filesystem/domain/filesystem.error'

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
    private readonly prismaService: PrismaService,
  ) {}

  async execute(query: FindJobQuery): Promise<JobResponseDto> {
    const job = await this.jobRepository.findJobOrThrow(query.jobId)
    const jobFolder = await this.prismaService.googleJobFolder.findFirst({
      where: { jobId: job.id },
    })
    if (!jobFolder) throw new GoogleDriveJobFolderNotFoundException()
    return this.jobMapper.toResponseWithJobFolderId(job, jobFolder.id)
  }
}
