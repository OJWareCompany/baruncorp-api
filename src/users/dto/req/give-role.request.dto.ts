import { IsString } from 'class-validator'

export class GiveRoleRequestDto {
  @IsString()
  userId: string
  @IsString()
  lol: string
}
