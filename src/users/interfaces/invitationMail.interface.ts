import { InvitationEmail } from '@prisma/client'

export interface InvitationEmailProp extends InvitationEmail {
  code: string
  organizationId: number
  email: string
  role: string
  organizationType: string
}
