import { IsString } from 'class-validator'

export class PutMemberInChargeOfTheServiceRequestDto {
  @IsString()
  userId: string
  @IsString()
  serviceId: string
}
