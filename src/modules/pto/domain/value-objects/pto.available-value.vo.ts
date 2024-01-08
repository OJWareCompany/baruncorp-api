import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoAvailableValueProps {
  value: number
}

export class PtoAvailableValue extends ValueObject<PtoAvailableValueProps> {
  get value(): number {
    return this.props.value
  }

  protected validate(props: PtoAvailableValueProps): void {
    return
  }
}
