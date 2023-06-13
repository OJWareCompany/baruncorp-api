import { InvitationEmailProp } from '../interfaces/invitationMail.interface'

export interface InvitationMailRepositoryPort {
  findOne(code: string): Promise<InvitationEmailProp>
  insertOne(props: InvitationEmailProp): Promise<InvitationEmailProp>
  deleteOne(code: string): Promise<void>
}
