import { ApiProperty } from '@nestjs/swagger'

export class UserPositionResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}
