import { EmailVO } from '../vo/email.vo'
import { InputPasswordVO } from '../vo/password.vo'
import { UserEntity } from '../entities/user.entity'
import { UserName } from '../vo/user-name.vo'
import { UserRoleEntity } from '../entities/user-role.entity'

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
  findRoleByUserId(userId: string): Promise<UserRoleEntity>
  giveRole(prop: UserRoleEntity): Promise<void>
  removeRole(entity: UserRoleEntity): Promise<void>
  transaction(...args: any[]): Promise<any>
}
