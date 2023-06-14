import { UserProp } from '../interfaces/user.interface'

export class UserNameVO implements Pick<UserProp, 'firstName' | 'lastName'> {
  firstName: string
  lastName: string
}
