import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import { UserEntity } from '../domain/user.entity'
import { LicenseEntity } from '../user-license.entity'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findOneByIdOrThrow(id: string): Promise<UserEntity>
  findUserByEmailOrThrow(email: EmailVO): Promise<UserEntity>
  findPasswordByUserId(id: string): Promise<string | null>
  insertUserPassword(entity: UserEntity, password: InputPasswordVO): Promise<void>
  update(entity: UserEntity): Promise<void>
  transaction(...args: any[]): Promise<any>

  // findUserLicenses? findLicensesByUserId?
  findAllLicenses(): Promise<LicenseEntity[]>
}
