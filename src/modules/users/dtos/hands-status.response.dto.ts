import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class HandsStatusResponseDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean
}
