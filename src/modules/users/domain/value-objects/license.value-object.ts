import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface LicenseProps {
  type: LicenseTypeEnum
  ownerName: string
  issuingCountryName: string
  abbreviation: string
  expiryDate: Date | null
}

export class License extends ValueObject<LicenseProps> {
  get type(): LicenseTypeEnum {
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

  get expiryDate(): Date | null {
    return this.props.expiryDate
  }

  protected validate(props: LicenseProps): void {
    return
  }
}
