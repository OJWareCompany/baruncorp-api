import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class PtoResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  id: string
  constructor(props: PtoResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Deo' })
  userFirstName: string
  @ApiProperty({ default: 'John' })
  userLastName: string
  @ApiProperty({ default: '2024-01-01' })
  userDateOfJoining: string
  @ApiProperty({ default: 3 })
  tenure: number
  @ApiProperty({ default: 12 })
  total: number
  @ApiProperty({ default: 5 })
  availablePto: number
  @ApiProperty({ default: false })
  isPaid: boolean
  @ApiProperty({ default: '2024-01-01' })
  startedAt: string
  @ApiProperty({ default: '2024-12-30' })
  endedAt: string
}
