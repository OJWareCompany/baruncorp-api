import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class CreateTaskCommand {
  readonly serviceId: string
  readonly name: string
  readonly licenseType: LicenseTypeEnum | null
  constructor(props: CreateTaskCommand) {
    initialize(this, props)
  }
}
