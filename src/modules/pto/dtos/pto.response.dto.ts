import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { PtoDetailResponseDto } from './pto-detail.response.dto'

export class PtoResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  id: string
  constructor(props: PtoResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: '2024-01-07' })
  startedAt: Date | null
  @ApiProperty({ default: '2024-01-07' })
  endedAt: Date | null
  @ApiProperty({ default: 3 })
  tenure: number
  @ApiProperty({ default: 12 })
  total: number
  @ApiProperty({ default: 5 })
  availablePto: number
  @ApiProperty({ default: false, required: false })
  isPaid?: boolean
}
