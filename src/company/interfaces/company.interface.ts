import { Companies } from '@prisma/client'

export interface CompanyProp extends Companies {
  id: number
  name: string
  description: string
  companyType: string
}
