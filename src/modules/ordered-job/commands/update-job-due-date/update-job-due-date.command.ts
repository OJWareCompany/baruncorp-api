import { initialize } from '../../../../libs/utils/constructor-initializer'

export class UpdateJobDueDateCommand {
  readonly jobId: string
  readonly dueDate: Date
  readonly editorUserId: string

  constructor(props: UpdateJobDueDateCommand) {
    initialize(this, props)
  }
}
