import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class PositionUnregisteredUserResponseFields {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsString()
  email: string
}

export class PositionUnregisteredUserResponseDto {
  @ApiProperty({ type: PositionUnregisteredUserResponseFields, isArray: true })
  items: PositionUnregisteredUserResponseFields[]
}
