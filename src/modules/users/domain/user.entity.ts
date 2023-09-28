import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateUserProps, UserProps } from './user.types'
import { UserName } from './value-objects/user-name.vo'
import { Phone } from './value-objects/phone-number.value-object'
import { UserRoleNameEnum } from './value-objects/user-role.vo'

// where should it be 'id'? Entity or Prop?
// 'id' should be in base entity
export class UserEntity extends AggregateRoot<UserProps> {
  protected _id: string

  static create(create: CreateUserProps): UserEntity {
    const id = v4()
    const type = create.organization.organizationType === 'administration' ? 'member' : 'client'
    const role = type === 'member' ? UserRoleNameEnum.member : UserRoleNameEnum.client
    const props: UserProps = {
      ...create,
      type,
      role,
      position: null,
      licenses: [],
      services: [],
    }
    return new UserEntity({ id, props })
  }

  get role(): UserRoleNameEnum {
    return this.props.role
  }

  private changeRole(newRole: UserRoleNameEnum): void {
    this.props.role = newRole
  }

  makeAdmin(): void {
    this.changeRole(UserRoleNameEnum.admin)
  }

  makeMember(): void {
    this.changeRole(UserRoleNameEnum.member)
  }

  registerLicense() {
    //         expiryDate: null,
    //         issuedDate: null,
    //         priority: null,
    //         updatedAt: new Date(),
    //         createdAt: new Date(),
    //         userId: '',
    //         abbreviation: '',
    //         issuingCountryName: '',
  }

  revokeLicense() {
    //
  }

  updateName(userName: UserName): this {
    this.props.userName = userName
    return this
  }

  updatePhoneNumber(phoneNumber: string | null): this {
    this.props.phone = phoneNumber ? new Phone({ number: phoneNumber }) : null
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
