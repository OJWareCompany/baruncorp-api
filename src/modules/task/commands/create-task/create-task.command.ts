import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseRequiredEnum } from '../../domain/task.type'

export class CreateTaskCommand {
  readonly serviceId: string
  readonly name: string
  readonly licenseRequired: LicenseRequiredEnum | null
  constructor(props: CreateTaskCommand) {
    initialize(this, props)
  }
}
