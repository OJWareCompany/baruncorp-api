import { LicenseProps } from '@modules/users/user-license.type'
import { AggregateRoot } from '../../libs/ddd/aggregate-root.base'

export class LicenseEntity extends AggregateRoot<LicenseProps> {
  protected _id: string
  public validate(): void {
    return
  }
}
