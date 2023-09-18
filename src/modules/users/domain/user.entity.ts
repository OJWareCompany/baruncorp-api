import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateUserProps, UserProps } from './user.types'
import { UserName } from './value-objects/user-name.vo'

// where should it be 'id'? Entity or Prop?
// 'id' should be in base entity
export class UserEntity extends AggregateRoot<UserProps> {
  protected _id: string

  static create(create: CreateUserProps): UserEntity {
    const id = v4()
    const type = create.organizationType === 'administration' ? 'member' : 'client'
    const props: UserProps = { ...create, type }
    return new UserEntity({ id, props })
  }

  updateName(userName: UserName): this {
    this.props.userName = userName
    return this
  }

  updatePhoneNumber(phoneNumber: string | null): this {
    this.props.phoneNumber = phoneNumber
    return this
  }

  updateDeliverableEmails(deliverablesEmails: string[]): this {
    this.props.deliverablesEmails = deliverablesEmails
    return this
  }

  public validate(): void {
    const result = 1 + 1
  }
}
