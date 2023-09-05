import { initialize } from '../../../../libs/utils/constructor-initializer'

export class CreateJobNoteCommand {
  readonly content: string
  readonly jobId: string
  readonly commenterUserId: string
  constructor(props: CreateJobNoteCommand) {
    initialize(this, props)
  }
}
