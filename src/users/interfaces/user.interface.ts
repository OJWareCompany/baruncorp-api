import { Users } from '@prisma/client'

export interface UserProp extends Users {
  email: string
  organizationId: string
}

export enum UserRoles {
  admin = 'admin',
  member = 'member',
  guest = 'guest',
}
