import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoDetailProps {
  typeId: string
  amount: number
  startedAt: Date
  days: number
}

export class PtoDetail extends ValueObject<PtoDetailProps> {
  get typeId(): string {
    return this.props.typeId
  }

  get amount(): number {
    return this.props.amount
  }

  get startedAt(): Date {
    return this.props.startedAt
  }

  get days(): number {
    return this.props.days
  }

  protected validate(props: PtoDetailProps): void {
    return
  }
}
