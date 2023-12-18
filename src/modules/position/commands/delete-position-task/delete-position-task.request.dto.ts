import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePositionTaskParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly taskId: string
}
