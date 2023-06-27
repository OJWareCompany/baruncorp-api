import { Organizations } from '@prisma/client'

export interface OrganizationProp extends Organizations {
  id: number
  name: string
  description: string
  organizationType: string
}
