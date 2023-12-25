import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindUserRequestDto {
  @ApiProperty()
  @IsString()
  readonly userId: string
}
