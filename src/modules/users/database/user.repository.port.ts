import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import { UserEntity } from '../domain/user.entity'
import { UserRole } from '../domain/value-objects/user-role.vo'
import { LicenseEntity } from '../user-license.entity'
import { LicenseType } from '../user-license.type'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findAll(): Promise<UserEntity[]>
  findOneById(id: string): Promise<UserEntity>
  findOneByEmail(email: EmailVO): Promise<UserEntity>
  findByOrganizationId(organizationId: string): Promise<UserEntity[]>
  findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'> | null>
  findPasswordByUserId(id: string): Promise<string | null>
  insertUser(entity: UserEntity, password: InputPasswordVO): Promise<void>
  update(entity: UserEntity): Promise<void>
  findRoleByUserId(userId: string): Promise<UserRole>
  giveRole(prop: UserRole): Promise<void>
  removeRole(entity: UserRole): Promise<void>
  transaction(...args: any[]): Promise<any>

  // findUserLicenses? findLicensesByUserId?
  findAllLicenses(): Promise<LicenseEntity[]>
  findLicensesByUser(user: UserEntity): Promise<LicenseEntity[]>
  registerLicense(entity: LicenseEntity): Promise<void>
  revokeLicense(userId: string, type: LicenseType, issuingCountryName: string): Promise<void>
}
