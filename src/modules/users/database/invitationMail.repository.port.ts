import { CreateInvitationMailProp, InvitationEmailProp } from '../domain/invitationMail.types'
import { EmailVO } from '../domain/value-objects/email.vo'

export interface InvitationMailRepositoryPort {
  findOne(email: EmailVO): Promise<InvitationEmailProp | null>
  insertOne(props: CreateInvitationMailProp): Promise<InvitationEmailProp>
}
