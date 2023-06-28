import { Organizations } from '@prisma/client'

export interface OrganizationProp extends Organizations {
  id: string
  name: string
  description: string
  organizationType: string
}
