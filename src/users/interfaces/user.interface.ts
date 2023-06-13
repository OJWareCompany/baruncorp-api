import { Users } from '@prisma/client'

export interface UserProp extends Users {
  email: string
}
