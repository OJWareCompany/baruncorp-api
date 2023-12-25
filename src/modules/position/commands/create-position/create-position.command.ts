import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class CreatePositionCommand {
  readonly name: string
  readonly description?: string | null
  readonly maxAssignedTasksLimit: number | null
  readonly licenseType: LicenseTypeEnum | null
  constructor(props: CreatePositionCommand) {
    initialize(this, props)
  }
}
