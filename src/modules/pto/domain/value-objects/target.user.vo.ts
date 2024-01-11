import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoTargetUserProps {
  id: string
  dateOfJoining: Date
}

export class PtoTargetUser extends ValueObject<PtoTargetUserProps> {
  get id(): string {
    return this.props.id
  }

  get dateOfJoining(): Date {
    return this.props.dateOfJoining
  }

  protected validate(props: PtoTargetUserProps): void {
    return
  }
}
