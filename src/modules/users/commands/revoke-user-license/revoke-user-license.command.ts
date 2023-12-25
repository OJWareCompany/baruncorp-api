import { initialize } from '../../../../libs/utils/constructor-initializer'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export class RevokeUserLicenseCommand {
  readonly userId: string
  readonly type: LicenseTypeEnum
  readonly abbreviation: string
  constructor(props: RevokeUserLicenseCommand) {
    initialize(this, props)
  }
}
