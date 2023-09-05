/**
 * 전체 uesr-position 조회했을때는?
 */

import { ApiProperty } from '@nestjs/swagger'

export class PositionResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  department: string
}
