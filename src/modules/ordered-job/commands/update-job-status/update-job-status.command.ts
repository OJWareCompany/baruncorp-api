import { initialize } from '../../../../libs/utils/constructor-initializer'
import { JobStatusEnum } from '../../domain/job.type'

export class UpdateJobStatusCommand {
  readonly jobId: string
  readonly status: JobStatusEnum
  readonly editorUserId: string

  constructor(props: UpdateJobStatusCommand) {
    initialize(this, props)
  }
}
