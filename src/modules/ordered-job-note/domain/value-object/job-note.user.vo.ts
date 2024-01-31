import { ValueObject } from '../../../../libs/ddd/value-object.base'
import { LicenseTypeEnum } from '../../../license/dtos/license.response.dto'

export interface JobNoteUserProps {
  fullName: string
  email: string
}

export class JobNoteUser extends ValueObject<JobNoteUserProps> {
  get fullName(): string {
    return this.props.fullName
  }

  get email(): string {
    return this.props.email
  }

  protected validate(props: JobNoteUserProps): void {
    return
  }
}
