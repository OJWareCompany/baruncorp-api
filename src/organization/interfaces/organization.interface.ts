import { Organizations } from '@prisma/client'

export interface OrganizationProp extends Organizations {
  id: string
  name: string
  description: string | null
  email: string | null
  organizationType: string
  city: string | null
  country: string | null
  phoneNumber: string | null
  postalCode: string | null
  stateOrRegion: string | null
  street1: string | null
  street2: string | null
}
