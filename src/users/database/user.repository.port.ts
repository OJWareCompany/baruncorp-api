import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import { UserEntity } from '../domain/user.entity'
import { UserName } from '../domain/value-objects/user-name.vo'
import { UserRole } from '../domain/value-objects/user-role.vo'
import { LicenseEntity, LicenseType } from '../user-license.entity'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findAll(): Promise<UserEntity[]>
  findOneById(id: string): Promise<UserEntity>
  findOneByEmail(email: EmailVO): Promise<UserEntity>
  findByOrganizationId(organizationId: string): Promise<UserEntity[]>
  findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'>>
  findPasswordByUserId(id: string): Promise<string>
  insertUser(entity: UserEntity, password: InputPasswordVO): Promise<void>
  update(userId: string, props: UserName): Promise<void>
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
