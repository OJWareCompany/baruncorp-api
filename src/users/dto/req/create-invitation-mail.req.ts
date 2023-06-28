import { IsNumber, IsString } from 'class-validator'
import { InvitationEmailProp } from '../../../users/interfaces/invitationMail.interface'

export class CreateInvitationMailReq implements Pick<InvitationEmailProp, 'email' | 'organizationId' | 'role'> {
  // @IsString()
  readonly role: string

  // TODO: to name
  @IsNumber()
  readonly organizationId: string

  @IsString()
  readonly email: string
}
