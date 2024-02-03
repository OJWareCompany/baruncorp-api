import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobNoteMapper } from '../../job-note.mapper'
import { JobNoteResponseDto } from '../../dtos/job-note.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { JobNotePagenatedResponseDto } from '../../dtos/job-note.pagenated.response.dto'
import { JobNotFoundException } from '../../../../modules/ordered-job/domain/job.error'
import { GoogleJobNoteFolder, JobNoteType, OrderedJobNotes, PtoDetails, Ptos, PtoTypes, Users } from '@prisma/client'
import { JobNoteTypeEnum } from '../../domain/job-note.type'

export class FindJobNotePagenatedQuery extends PaginatedQueryBase {
  readonly jobId: string
  constructor(props: PaginatedParams<FindJobNotePagenatedQuery>) {
    super(props)
    initialize(this, props)
  }
}

@QueryHandler(FindJobNotePagenatedQuery)
export class FindJobNotesQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindJobNotePagenatedQuery): Promise<JobNotePagenatedResponseDto> {
    const jobRecord = await this.prismaService.orderedJobs.findUnique({
      where: { id: query.jobId },
    })
    if (!jobRecord) throw new JobNotFoundException()

    const records = await this.prismaService.orderedJobNotes.findMany({
      where: { jobId: query.jobId },
      include: {
        jobNoteFolder: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
    })

    const totalCount: number = await this.prismaService.orderedJobNotes.count({
      where: {
        jobId: query.jobId,
      },
    })

    const response: JobNotePagenatedResponseDto = {
      clientOrganizationName: jobRecord.clientOrganizationName,
      projectType: jobRecord.projectType,
      propertyAddress: jobRecord.propertyAddress,
      jobRequestNumber: jobRecord.jobRequestNumber,
      pagenated: new Paginated({
        page: query.page,
        pageSize: query.limit,
        totalCount: totalCount,
        items: await Promise.all(
          records.map(async (record) => {
            let creatorName = 'System'
            if (record.createdBy) {
              const targetUserName: { full_name: string } | null = await this.prismaService.users.findUnique({
                where: { id: record.createdBy },
                select: {
                  full_name: true,
                },
              })

              if (targetUserName) {
                creatorName = targetUserName.full_name
              }
            }
            const dto: JobNoteResponseDto = {
              id: record.id,
              creatorName: creatorName,
              content: record.content,
              type: record.type === JobNoteType.JobNote ? JobNoteTypeEnum.JobNote : JobNoteTypeEnum.RFI,
              jobNoteNumber: record.jobNoteNumber,
              senderMail: record.senderEmail,
              receiverMails: record.receiverEmails ? record.receiverEmails.split(',') : null,
              createdAt: record.createdAt,
              fileShareLink: record.jobNoteFolder?.shareLink ?? null,
            }
            return dto
          }),
        ),
      }),
    }

    return response
  }
}
