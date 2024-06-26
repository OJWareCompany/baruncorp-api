import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface PtoTargetUserProps {
  id: string
  firstName: string
  lastName: string
  dateOfJoining: Date | null
}

export class PtoTargetUser extends ValueObject<PtoTargetUserProps> {
  get id(): string {
    return this.props.id
  }

  get firstName(): string {
    return this.props.firstName
  }

  get lastName(): string {
    return this.props.lastName
  }

  get dateOfJoining(): Date | null {
    return this.props.dateOfJoining
  }

  protected validate(props: PtoTargetUserProps): void {
    return
  }
}
