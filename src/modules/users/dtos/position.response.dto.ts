import { ApiProperty } from '@nestjs/swagger'

export class PositionResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}
