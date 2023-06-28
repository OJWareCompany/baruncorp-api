import { CreateInvitationMailProp, InvitationEmailProp } from '../interfaces/invitationMail.interface'
import { EmailVO } from '../vo/email.vo'

export interface InvitationMailRepositoryPort {
  findOne(code: string, email: EmailVO): Promise<InvitationEmailProp>
  insertOne(props: CreateInvitationMailProp): Promise<InvitationEmailProp>
  deleteOne(code: string): Promise<void>
}
