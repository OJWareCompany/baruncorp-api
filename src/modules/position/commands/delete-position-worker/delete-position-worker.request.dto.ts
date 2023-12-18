import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeletePositionWorkerParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly userId: string
}
