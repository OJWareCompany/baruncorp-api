import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseType } from '../../user-license.type'

export interface LicenseProps {
  type: LicenseType
  ownerName: string
  issuingCountryName: string
  abbreviation: string
  priority: number | null
  expiryDate: Date | null
}

export class License extends ValueObject<LicenseProps> {
  get type(): LicenseType {
    return this.props.type
  }

  get ownerName(): string {
    return this.props.ownerName
  }

  get issuingCountryName(): string {
    return this.props.issuingCountryName
  }

  get abbreviation(): string {
    return this.props.abbreviation
  }

  get priority(): number | null {
    return this.props.priority
  }

  get expiryDate(): Date | null {
    return this.props.expiryDate
  }

  protected validate(props: LicenseProps): void {
    return
  }
}
