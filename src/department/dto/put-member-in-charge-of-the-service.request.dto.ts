import { IsString } from 'class-validator'

export class PutMemberInChargeOfTheService {
  @IsString()
  userId: string
  @IsString()
  serviceId: string
}
