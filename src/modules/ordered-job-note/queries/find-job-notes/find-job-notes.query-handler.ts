import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { initialize } from '../../../../libs/utils/constructor-initializer'
import { PrismaService } from '../../../database/prisma.service'
import { JobNoteMapper } from '../../job-note.mapper'
import { JobNoteListResponseDto } from '../../dtos/job-note.response.dto'

export class FindJobNotesQuery {
  readonly jobId: string
  constructor(props: FindJobNotesQuery) {
    initialize(this, props)
  }
}

@QueryHandler(FindJobNotesQuery)
export class FindJobNotesQueryHandler implements IQueryHandler {
  constructor(private readonly prismaService: PrismaService, private readonly jobNoteMapper: JobNoteMapper) {}
  async execute(query: FindJobNotesQuery): Promise<JobNoteListResponseDto> {
    const records = await this.prismaService.orderedJobNotes.findMany({
      where: { jobId: query.jobId },
      orderBy: { createdAt: 'desc' },
    })
    const entities = records.map(this.jobNoteMapper.toDomain)
    return this.jobNoteMapper.toResponse(entities)
  }
}
