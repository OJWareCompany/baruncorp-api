import { UserRole } from '@prisma/client'

export interface UserRoleProp extends UserRole {
  role: string
  organizationType: string
  userId: string
}
