import { IsString } from 'class-validator'

export class CreateInvitationMailRequestDto {
  @IsString()
  readonly organizationName: string

  @IsString()
  readonly email: string
}
