import { InvitationEmail } from '@prisma/client'

export interface InvitationEmailProp extends InvitationEmail {
  code: string
  companyId: number
  role: string
  companyType: string
}
