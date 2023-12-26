import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateUserProps, UserProps, UserStatusEnum } from './user.types'
import { UserName } from './value-objects/user-name.vo'
import { Phone } from './value-objects/phone-number.value-object'
import { UserRoleNameEnum } from './value-objects/user-role.vo'
import { PhoneNumberFormatException } from '../user.error'
import { InputPasswordVO } from './value-objects/password.vo'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'
import { License } from './value-objects/license.value-object'

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
      availableTasks: [],
      isHandRaisedForTask: false,
      status: UserStatusEnum.SIGN_UP_NOT_COMPLETED,
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

  revokeLicense(props: { abbreviation: string; type: LicenseTypeEnum }) {
    const origin = this.props.licenses
    this.props.licenses = origin.filter((license) => {
      return !(license.abbreviation === props.abbreviation && license.type === props.type)
    })
    return this
  }

  invite() {
    this.props.status = UserStatusEnum.INVITATION_SENT
    return this
  }

  signUp(name: UserName, phone: Phone, deliverablesEmails: string[]) {
    this.props.userName = name
    this.props.phone = phone
    this.props.deliverablesEmails = deliverablesEmails
    this.props.status = UserStatusEnum.ACTIVE
    return this
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
