import { JobNoteType, OrderedJobNotes } from '@prisma/client'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { JobNoteEntity } from './domain/job-note.entity'
import { JobNoteResponseDto } from './dtos/job-note.response.dto'
import { Injectable } from '@nestjs/common'
import { JobNoteProps, JobNoteTypeEnum } from './domain/job-note.type'
import { JobNoteModel, JobNoteQueryModel } from './database/job-note.repository'

@Injectable()
export class JobNoteMapper implements Mapper<JobNoteEntity, JobNoteModel, JobNoteResponseDto> {
  toPersistence(entity: JobNoteEntity): JobNoteModel {
    const props = entity.getProps()
    const record: JobNoteModel = {
      id: entity.id,
      jobId: props.jobId,
      createdBy: props.creatorUserId,
      content: props.content,
      type: props.type === JobNoteTypeEnum.JobNote ? JobNoteType.JobNote : JobNoteType.RFI,
      jobNoteNumber: props.jobNoteNumber,
      receiverEmails: props.receiverEmails ? props.receiverEmails.toString() : null,
      createdAt: props.createdAt,
      senderEmail: props.senderEmail,
    }
    return record
  }

  toDomain(record: JobNoteQueryModel): JobNoteEntity {
    return new JobNoteEntity({
      id: record.id,
      props: {
        jobId: record.jobId,
        creatorUserId: record.createdBy,
        content: record.content,
        creatorUser: null,
        receiverEmails: record.receiverEmails ? record.receiverEmails.split(',') : null,
        type: record.type === JobNoteType.JobNote ? JobNoteTypeEnum.JobNote : JobNoteTypeEnum.RFI,
        jobNoteNumber: record.jobNoteNumber,
        senderEmail: record.senderEmail,
      },
    })
  }
  // 사용 하지 않음
  toResponse(entity: JobNoteEntity | JobNoteEntity[]): JobNoteResponseDto {
    const entities = Array.isArray(entity) ? entity : [entity]
    // const notes = entities.map((note) => {
    //   const response = new JobNoteResponseDto()
    //   response.jobNoteId = note.id
    //   response.content = note.getProps().content
    //   response.jobId = note.getProps().jobId
    //   response.commenterName = note.getProps().commenterName
    //   response.commenterUserId = note.getProps().commenterUserId
    //   response.createdAt = note.createdAt.toISOString()
    //   return response
    // })

    const response = new JobNoteResponseDto()
    // response.notes = notes
    return response
  }
}
