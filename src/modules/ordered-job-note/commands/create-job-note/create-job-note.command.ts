import { initialize } from '../../../../libs/utils/constructor-initializer'
import { JobNoteTypeEnum } from '../../domain/job-note.type'

export class CreateJobNoteCommand {
  readonly jobId: string
  readonly creatorUserId: string
  readonly content: string
  readonly emailBody: string
  readonly type: JobNoteTypeEnum
  readonly receiverEmails: string[] | null
  readonly files: Express.Multer.File[] | null

  constructor(props: CreateJobNoteCommand) {
    initialize(this, props)
  }
}
