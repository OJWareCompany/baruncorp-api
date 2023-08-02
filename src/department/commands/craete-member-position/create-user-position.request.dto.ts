import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateMemberPositionRequestDto {
  @ApiProperty({ default: '3696b9c7-916d-4812-871e-976c03a06d7e' })
  @IsString()
  readonly positionId: string

  @ApiProperty({ default: '96d39061-a4d7-4de9-a147-f627467e11d5' })
  @IsString()
  readonly userId: string
}
