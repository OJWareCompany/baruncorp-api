import { OrderedJobNotes } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { JobNoteEntity, JobNoteProps } from './domain/job-note.entity'
import { JobNoteListResponseDto, JobNoteResponseDto } from './dtos/job-note.response.dto'

export class JobNoteMapper implements Mapper<JobNoteEntity, OrderedJobNotes, JobNoteListResponseDto> {
  toPersistence(entity: JobNoteEntity): OrderedJobNotes {
    const props: JobNoteProps = entity.getProps()
    return {
      id: entity.id,
      jobId: props.jobId,
      content: props.content,
      commenterName: props.commenterName,
      commenterUserId: props.commenterUserId,
      createdAt: entity.createdAt,
    }
  }

  toDomain(record: OrderedJobNotes): JobNoteEntity {
    return new JobNoteEntity({
      id: record.id,
      props: {
        content: record.content,
        jobId: record.jobId,
        commenterName: record.commenterName,
        commenterUserId: record.commenterUserId,
      },
      createdAt: record.createdAt,
    })
  }

  toResponse(entity: JobNoteEntity | JobNoteEntity[]): JobNoteListResponseDto {
    const entities = Array.isArray(entity) ? entity : [entity]
    const notes = entities.map((note) => {
      const response = new JobNoteResponseDto()
      response.jobNoteId = note.id
      response.content = note.getProps().content
      response.jobId = note.getProps().jobId
      response.commenterName = note.getProps().commenterName
      response.commenterUserId = note.getProps().commenterUserId
      response.createdAt = note.createdAt.toISOString()
      return response
    })

    const response = new JobNoteListResponseDto()
    response.notes = notes
    return response
  }
}
