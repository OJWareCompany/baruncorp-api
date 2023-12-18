import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePositionParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}
