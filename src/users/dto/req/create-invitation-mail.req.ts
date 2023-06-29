import { IsString } from 'class-validator'

export class CreateInvitationMailReq {
  @IsString()
  readonly organizationName: string

  @IsString()
  readonly roleName: string

  @IsString()
  readonly email: string
}
