import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import { UserEntity } from '../domain/user.entity'
import { LicenseEntity } from '../user-license.entity'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findOneById(id: string): Promise<UserEntity>
  findOneByEmail(email: EmailVO): Promise<UserEntity>
  findUserIdByEmail(email: EmailVO): Promise<Pick<UserEntity, 'id'> | null>
  findPasswordByUserId(id: string): Promise<string | null>
  insertUser(entity: UserEntity, password: InputPasswordVO): Promise<void>
  update(entity: UserEntity): Promise<void>
  transaction(...args: any[]): Promise<any>

  // findUserLicenses? findLicensesByUserId?
  findAllLicenses(): Promise<LicenseEntity[]>
}
