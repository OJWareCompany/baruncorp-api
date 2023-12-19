import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeletePrerequisiteTaskCommand {
  readonly taskId: string
  readonly prerequisiteTaskId: string
  constructor(props: DeletePrerequisiteTaskCommand) {
    initialize(this, props)
  }
}
