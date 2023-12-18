import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AddPositionWorkerParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly positionId: string
}

export class AddPositionWorkerRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly userId: string
}
