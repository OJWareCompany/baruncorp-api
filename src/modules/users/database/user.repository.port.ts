import { EmailVO } from '../domain/value-objects/email.vo'
import { InputPasswordVO } from '../domain/value-objects/password.vo'
import { UserEntity } from '../domain/user.entity'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findOneById(id: string): Promise<UserEntity | null>
  findOneByIdOrThrow(id: string): Promise<UserEntity>
  findOneByIdIncludePtos(id: string): Promise<UserEntity>
  findUserByEmailOrThrow(email: EmailVO): Promise<UserEntity>
  findPasswordByUserId(id: string): Promise<string | null>
  insertUserPassword(entity: UserEntity, password: InputPasswordVO): Promise<void>
  update(entity: UserEntity): Promise<void>
  transaction(...args: any[]): Promise<any>
}
