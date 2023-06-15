import { EmailVO } from '../vo/email.vo'
import { UserProp } from '../interfaces/user.interface'
import { InputPasswordVO } from '../vo/password.vo'

export interface UserRepositoryPort {
  // TODO: generate uuidVO
  findOneById(id: string): Promise<UserProp>
  findOneByEmail(email: EmailVO): Promise<UserProp>
  findUserIdByEmail(email: EmailVO): Promise<Pick<UserProp, 'id'>>
  findPasswordByUserId(id: string): Promise<string>
  insertUser(
    companyId: number,
    userProps: Omit<UserProp, 'id' | 'companyId'>,
    password: InputPasswordVO,
  ): Promise<UserProp>
  update(userId: string, props: Pick<UserProp, 'firstName' | 'lastName'>): Promise<UserProp>
  transaction(...args: any[]): Promise<any>
}
