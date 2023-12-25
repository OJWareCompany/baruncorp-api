import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class UpdateTaskCommand {
  readonly taskId: string
  readonly name: string
  readonly licenseType: LicenseTypeEnum | null
  constructor(props: UpdateTaskCommand) {
    initialize(this, props)
  }
}
