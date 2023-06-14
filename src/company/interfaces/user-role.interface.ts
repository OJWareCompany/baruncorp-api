import { UserRole } from '@prisma/client'

export interface UserRoleProp extends UserRole {
  role: string
  companyType: string
  userId: string
}
