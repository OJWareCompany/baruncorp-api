import { InvitationEmail } from '@prisma/client'

export interface InvitationEmailProp extends InvitationEmail {
  code: string
  companyId: number
  email: string
  role: string
  companyType: string
}
