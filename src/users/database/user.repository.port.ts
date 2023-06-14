import { EmailVO } from '../vo/email.vo'
import { UserProp } from '../interfaces/user.interface'
import { PasswordProp } from '../interfaces/password.interface'
import { InputPasswordVO } from '../vo/password.vo'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findOneByEmail(email: EmailVO): Promise<UserProp>
  findUserIdByEmail(email: EmailVO): Promise<Pick<UserProp, 'id'>>
  findPasswordByUserId(id: string): Promise<string>
  insertUser(
    companyId: number,
    userProps: Omit<UserProp, 'id' | 'companyId'>,
    password: InputPasswordVO,
  ): Promise<UserProp>
  transaction(...args: any[]): Promise<any>
}
