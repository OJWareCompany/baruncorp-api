import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeactivateUserRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}
