import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoDetailProps {
  id: string
  name: string
  abbreviation: string
  amount: number
  days: number
  startedAt: Date
}

export class PtoDetail extends ValueObject<PtoDetailProps> {
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get abbreviation(): string {
    return this.props.abbreviation
  }

  get amount(): number {
    return this.props.amount
  }

  get startedAt(): Date {
    return this.props.startedAt
  }

  protected validate(props: PtoDetailProps): void {
    return
  }
}
