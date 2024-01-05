import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ReactivateUserRequestParamDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}
