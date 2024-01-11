import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoDetailProps {
  id: string
  name: string
  abbreviation: string
  value: number
  days: number
  startedAt: Date
  endedAt: Date
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

  get value(): number {
    return this.props.value
  }

  get startedAt(): Date {
    return this.props.startedAt
  }

  get endedAt(): Date {
    return this.props.endedAt
  }

  protected validate(props: PtoDetailProps): void {
    return
  }
}
