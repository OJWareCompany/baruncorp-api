import { initialize } from '../../../../libs/utils/constructor-initializer'

export class AddPrerequisiteTaskCommand {
  readonly taskId: string
  readonly prerequisiteTaskId: string
  constructor(props: AddPrerequisiteTaskCommand) {
    initialize(this, props)
  }
}
