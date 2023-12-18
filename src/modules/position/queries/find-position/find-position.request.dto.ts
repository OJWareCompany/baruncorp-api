import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindPositionRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}
