import { IsString } from 'class-validator'
import { UserNameVO } from '../../../users/vo/user-name.vo'

export class UpdateUserReq extends UserNameVO {
  @IsString()
  firstName: string

  @IsString()
  lastName: string
}
