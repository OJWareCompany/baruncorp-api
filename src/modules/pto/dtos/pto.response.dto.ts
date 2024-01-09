import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { PtoDetailResponseDto } from './pto-detail.response.dto'

export class PtoResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: PtoResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  userId: string
  @ApiProperty({ default: '3' })
  tenure: number
  @ApiProperty({ default: '12' })
  total: number
  @ApiProperty({ default: false })
  isPaid: boolean
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  createdAt: Date
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date
  @ApiProperty()
  details: PtoDetailResponseDto[]
}
