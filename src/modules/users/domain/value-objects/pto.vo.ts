import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoProps {
  isPaid: boolean
}

export class Pto extends ValueObject<PtoProps> {
  get isPaid(): boolean {
    return this.props.isPaid
  }

  protected validate(props: PtoProps): void {
    return
  }
}
