import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../user-license.type'

export class AppointUserLicenseCommand {
  readonly userId: string
  readonly type: LicenseTypeEnum
  readonly stateName: string
  readonly expiryDate: Date | null
  constructor(props: AppointUserLicenseCommand) {
    initialize(this, props)
  }
}
