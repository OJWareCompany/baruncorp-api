import { initialize } from '../../../../libs/utils/constructor-initializer'

export class DeleteProjectCommand {
  id: string

  constructor(props: DeleteProjectCommand) {
    initialize(this, props)
  }
}
