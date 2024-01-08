import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { Ptos } from '@prisma/client'
import { PtoAvailableValueResponseDto } from './pto-available-value.response.dto'

export class PtoResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string

  constructor(props: PtoResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Vacation' })
  name: string
  @ApiProperty()
  availableValues: PtoAvailableValueResponseDto[]
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  updatedAt: Date
}
