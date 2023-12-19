import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseRequiredEnum } from '../../domain/task.type'

export class UpdateTaskCommand {
  readonly taskId: string
  readonly name: string
  readonly isAutoAssignment: boolean
  readonly licenseRequired: LicenseRequiredEnum | null
  constructor(props: UpdateTaskCommand) {
    initialize(this, props)
  }
}
