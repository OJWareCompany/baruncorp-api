// import { Filesystems } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { GoogleJobNoteFolderEntity } from './domain/google-job-note-folder.entity'
import { GoogleJobNoteFolder } from '@prisma/client'

@Injectable()
export class GoogleJobNoteFolderMapper implements Mapper<GoogleJobNoteFolderEntity, GoogleJobNoteFolder, any> {
  toPersistence(entity: GoogleJobNoteFolderEntity): GoogleJobNoteFolder {
    const props = entity.getProps()
    const record: GoogleJobNoteFolder = {
      id: props.folderId,
      shareLink: props.shareLink,
      jobNotesFolderId: props.jobNotesFolderId,
      jobNoteId: props.jobNoteId,
    }
    return record
  }

  toDomain(record: GoogleJobNoteFolder): GoogleJobNoteFolderEntity {
    const entity = new GoogleJobNoteFolderEntity({
      id: record.id,
      props: {
        folderId: record.id,
        shareLink: record.shareLink ?? '',
        jobNotesFolderId: record.jobNotesFolderId ?? '',
        jobNoteId: record.jobNoteId ?? '',
      },
    })
    return entity
  }

  toResponse(entity: GoogleJobNoteFolderEntity): any {
    return null
  }
}
