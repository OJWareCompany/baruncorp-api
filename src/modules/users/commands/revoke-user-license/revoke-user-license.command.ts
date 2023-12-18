import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../user-license.type'

export class RevokeUserLicenseCommand {
  readonly userId: string
  readonly type: LicenseTypeEnum
  readonly stateName: string
  constructor(props: RevokeUserLicenseCommand) {
    initialize(this, props)
  }
}
