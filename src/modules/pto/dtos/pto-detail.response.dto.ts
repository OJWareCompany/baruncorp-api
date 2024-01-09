import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { Ptos } from '@prisma/client'

/**
 * Remove interface after select fields
 */
export class PtoDetailResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string

  constructor(props: PtoDetailResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Vacation' })
  name: string

  @ApiProperty({ default: 'V' })
  abbreviation: string

  @ApiProperty({ default: 5.5 })
  value: number

  @ApiProperty({ default: '2024-01-09T03:50:37.000Z' })
  startedAt: Date

  @ApiProperty({ default: '2024-01-09T03:50:37.000Z' })
  endedAt: Date
}
