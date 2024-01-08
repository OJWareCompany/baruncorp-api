import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { Ptos } from '@prisma/client'

/**
 * Remove interface after select fields
 */
export class PtoAvailableValueResponseDto {
  // @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  // @IsString()
  // readonly id: string

  constructor(props: PtoAvailableValueResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: '1' })
  value: number
}
