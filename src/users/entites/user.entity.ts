import { EmailVO } from '../vo/email.vo'
import { UserProp } from '../interfaces/user.interface'

// where should it be 'id'? Entity or Prop?
export class UserEntity implements UserProp {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly password: string
  readonly companyId: number

  constructor(email: EmailVO) {
    this.email = email.email
  }
}
