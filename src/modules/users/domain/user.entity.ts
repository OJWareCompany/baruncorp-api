import { UserStatusUpdatedDomainEvent } from '@modules/users/domain/events/user-status-updated.domain-event'
import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { DepartmentEntity } from '../../department/domain/department.entity'
import { LicenseTypeEnum } from '../../license/dtos/license.response.dto'
import {
  InvalidClientRoleAssignmentException,
  InvalidMemberRoleAssignmentException,
  PhoneNumberFormatException,
  SpecialAdminExistsException,
} from '../user.error'
import { CreateUserProps, UserProps, UserStatusEnum } from './user.types'
import { UserDateOfJoiningUpdatedDomainEvent } from './events/user-date-of-joining-updated.domain-event'
import { UserJoinedToOrganization } from './events/user-joined-organization.domain-event'
import { UserCreatedDomainEvent } from './events/user-created.domain-event'
import { UserRoleNameEnum } from './value-objects/user-role.vo'
import { Organization } from './value-objects/organization.value-object'
import { UserManager } from './domain-services/user-manager.domain-service'
import { UserName } from './value-objects/user-name.vo'
import { Phone } from './value-objects/phone-number.value-object'
import { PtoDetail } from './value-objects/pto-detail.vo'
import { Pto } from './value-objects/pto.vo'

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
      ptos: [],
      ptoDetails: [],
      isHandRaisedForTask: false,
      status: UserStatusEnum.INVITATION_NOT_SENT,
      isVendor: create.organization.organizationType === 'administration' ? false : create.isVendor,
      departmentId: null,
      departmentName: null,
    }
    return new UserEntity({ id, props })
  }

  get canEditOrderPostInvoice() {
    const grantedPermissions = [
      UserRoleNameEnum.client_company_manager,
      UserRoleNameEnum.special_admin,
      UserRoleNameEnum.admin,
    ]
    return grantedPermissions.includes(this.role)
  }

  get userName(): UserName {
    return this.props.userName
  }

  get isVendor(): boolean {
    return this.props.isVendor
  }

  get role(): UserRoleNameEnum {
    return this.props.role
  }

  get organization(): Organization {
    return this.props.organization
  }

  get isAdministrationMember() {
    return this.props.organization.organizationType === 'administration'
  }

  get dateOfJoining(): Date | null {
    return this.props.dateOfJoining
  }

  get ptos(): Pto[] {
    return this.props.ptos
  }

  get ptoDetails(): PtoDetail[] {
    return this.props.ptoDetails
  }

  changeRole(newRole: UserRoleNameEnum): UserEntity {
    if (UserRoleNameEnum.special_admin === newRole) throw new SpecialAdminExistsException()

    if (!this.isAdministrationMember && [UserRoleNameEnum.member, UserRoleNameEnum.admin].includes(newRole)) {
      throw new InvalidClientRoleAssignmentException()
    }

    if (
      this.isAdministrationMember &&
      [UserRoleNameEnum.client_company_employee, UserRoleNameEnum.client_company_manager].includes(newRole)
    ) {
      throw new InvalidMemberRoleAssignmentException()
    }

    this.props.type = newRole
    this.props.role = newRole
    return this
  }

  async reactivate(userManager: UserManager) {
    this.props.status = await userManager.determineUserStatus(this)
    this.setUserStatusChangedEvent()
    return this
  }

  deactivate() {
    this.props.status = UserStatusEnum.INACTIVE
    this.setUserStatusChangedEvent()
    return this
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

  async isAvailableWorker(userManager: UserManager) {
    if (await userManager.isPto(this)) {
      return false
    }
    const permittedRoles = [UserRoleNameEnum.admin, UserRoleNameEnum.member, UserRoleNameEnum.special_admin]
    return this.props.status === UserStatusEnum.ACTIVE && (this.isVendor || permittedRoles.includes(this.role))
  }

  invite() {
    this.props.status = UserStatusEnum.INVITATION_SENT
    this.setUserStatusChangedEvent()
    return this
  }

  signUp(name: UserName, phone: Phone | null, deliverablesEmails: string[]) {
    this.props.userName = name
    this.props.phone = phone
    this.props.deliverablesEmails = deliverablesEmails
    this.props.status = UserStatusEnum.ACTIVE
    this.setUserStatusChangedEvent()
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
    this.props.isVendor = this.props.organization.organizationType === 'administration' ? false : isVendor
    return this
  }

  updateDateOfJoining(newDateOfJoining: Date | null): this {
    this.props.dateOfJoining = newDateOfJoining

    this.addEvent(
      new UserDateOfJoiningUpdatedDomainEvent({
        aggregateId: this.id,
        dateOfJoining: this.props.dateOfJoining,
      }),
    )

    return this
  }

  setCreatePtoEvent(tenure: number, total: number): void {
    this.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: this.id,
        userId: this.id,
        tenure: tenure,
        total: total,
      }),
    )
  }

  setUserStatusChangedEvent() {
    this.addEvent(
      new UserStatusUpdatedDomainEvent({
        aggregateId: this.id,
        status: this.props.status,
        email: this.props.email,
      }),
    )
  }

  setDepartment(department: DepartmentEntity): void {
    this.props.departmentId = department.id
    this.props.departmentName = department.getProps().name
  }

  removeDepartment(): void {
    this.props.departmentId = null
    this.props.departmentName = null
  }

  joinOrganization(organization: Organization, dateOfJoining: Date | null): void {
    this.props.organization = organization
    this.props.dateOfJoining = dateOfJoining
    if (organization.organizationType === 'administration') {
      this.props.role = UserRoleNameEnum.member
      this.props.type = UserRoleNameEnum.member
      this.props.isVendor = false
    } else if (organization.organizationType === 'client') {
      this.props.role = UserRoleNameEnum.client_company_employee
      this.props.type = UserRoleNameEnum.client_company_employee
    } else {
      this.props.role = UserRoleNameEnum.viewer
      this.props.type = UserRoleNameEnum.viewer
      this.props.isVendor = false
    }
    this.addEvent(new UserJoinedToOrganization({ aggregateId: this.id, organizationId: organization.id }))
  }

  public validate(): void {
    if (this.props.phone && this.props.phone.number && this.props.phone.number.length > 20) {
      throw new PhoneNumberFormatException()
    }
  }
}
