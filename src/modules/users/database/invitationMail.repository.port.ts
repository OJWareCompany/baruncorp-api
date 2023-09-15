import { CreateInvitationMailProp, InvitationEmailProp } from '../domain/invitationMail.types'
import { EmailVO } from '../domain/value-objects/email.vo'

export interface InvitationMailRepositoryPort {
  findOne(code: string, email: EmailVO): Promise<InvitationEmailProp | null>
  insertOne(props: CreateInvitationMailProp): Promise<InvitationEmailProp>
  deleteOne(code: string): Promise<void>
}
