import { InvitationEmailProp } from '../interfaces/invitationMail.interface'
import { EmailVO } from '../vo/email.vo'

export interface InvitationMailRepositoryPort {
  findOne(code: string, email: EmailVO): Promise<InvitationEmailProp>
  insertOne(props: InvitationEmailProp): Promise<InvitationEmailProp>
  deleteOne(code: string): Promise<void>
}
