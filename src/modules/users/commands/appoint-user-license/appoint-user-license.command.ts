import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class AppointUserLicenseCommand {
  readonly userId: string
  readonly type: LicenseTypeEnum
  readonly abbreviation: string
  readonly expiryDate: Date | null
  constructor(props: AppointUserLicenseCommand) {
    initialize(this, props)
  }
}
