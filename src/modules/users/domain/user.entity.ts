import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateUserProps, UserProps } from './user.types'
import { UserName } from './value-objects/user-name.vo'
import { Phone } from './value-objects/phone-number.value-object'
import { UserRoleNameEnum } from './value-objects/user-role.vo'
import { PhoneNumberFormatException } from '../user.error'

// where should it be 'id'? Entity or Prop?
// 'id' should be in base entity
export class UserEntity extends AggregateRoot<UserProps> {
  protected _id: string

  static create(create: CreateUserProps): UserEntity {
    const id = v4()
    const role =
      create.organization.organizationType === 'administration'
        ? UserRoleNameEnum.member
        : UserRoleNameEnum.client_company_employee
    const props: UserProps = {
      ...create,
      type: role,
      role: role,
      position: null,
      licenses: [],
      services: [],
    }
    return new UserEntity({ id, props })
  }

  get isVendor() {
    return this.props.isVendor
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
    if (phoneNumber && phoneNumber.length > 20) throw new PhoneNumberFormatException()
    this.props.phone = phoneNumber ? new Phone({ number: phoneNumber }) : null
    return this
  }

  updateDeliverableEmails(deliverablesEmails: string[]): this {
    this.props.deliverablesEmails = deliverablesEmails
    return this
  }

  // update, set은 도메인 용어를 사용하지 않으므로 좋지 않은 예시 (어떤 행위를 했을때 그 안에서 아래의 업데이트가 따라와야함)
  updateVendor(isVendor: boolean): this {
    this.props.isVendor = isVendor
    return this
  }

  public validate(): void {
    if (this.props.phone && this.props.phone.number && this.props.phone.number.length > 20) {
      throw new PhoneNumberFormatException()
    }
  }
}
