import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteAvailableTaskCommand {
  readonly userId: string
  readonly taskId: string
  constructor(props: DeleteAvailableTaskCommand) {
    initialize(this, props)
  }
}
