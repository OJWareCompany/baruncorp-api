import { IsNumber, IsString } from 'class-validator'
import { InvitationEmailProp } from '../../../users/interfaces/invitationMail.interface'

export class CreateInvitationMailReq implements Pick<InvitationEmailProp, 'email' | 'companyId' | 'role'> {
  // @IsString()
  readonly role: string

  @IsNumber()
  readonly companyId: number

  @IsString()
  readonly email: string
}
