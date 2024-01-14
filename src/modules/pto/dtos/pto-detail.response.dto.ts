import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
export class PtoDetailResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  id: string
  constructor(props: PtoDetailResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Deo' })
  userFirstName: string
  @ApiProperty({ default: 'John' })
  userLastName: string
  @ApiProperty({ default: '2024-01-07' })
  startedAt: string
  @ApiProperty({ default: '2024-01-09' })
  endedAt: string
  @ApiProperty({ default: 3 })
  days: number
  @ApiProperty({ default: 1.5 })
  amount: number
  @ApiProperty({ default: 'Vacation' })
  ptoTypeName: string
}
