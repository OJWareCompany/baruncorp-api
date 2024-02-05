import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobNoteDetailResponseDto } from '../../dtos/job-note-detail.response.dto'
import { Paginated } from '../../../../libs/ddd/repository.port'
import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
import { JobNotFoundException } from '../../../../modules/ordered-job/domain/job.error'
import { GoogleJobNoteFolder, JobNoteType, OrderedJobNotes, PtoDetails, Ptos, PtoTypes, Users } from '@prisma/client'
import { JobNoteTypeEnum } from '../../domain/job-note.type'
import { JobNoteResponseDto } from '@modules/ordered-job-note/dtos/job-note.response.dto'

export class FindJobNoteQuery {
  readonly jobId: string
  constructor(props: FindJobNoteQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindJobNoteQuery)
export class FindJobNotesQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService) {}
  async execute(query: FindJobNoteQuery): Promise<JobNoteResponseDto> {
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
    })

    const response: JobNoteResponseDto = {
      clientOrganizationName: jobRecord.clientOrganizationName,
      projectType: jobRecord.projectType,
      propertyAddress: jobRecord.propertyAddress,
      jobRequestNumber: jobRecord.jobRequestNumber,
      data: await Promise.all(
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
          const dto: JobNoteDetailResponseDto = {
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
    }

    return response
  }
}
