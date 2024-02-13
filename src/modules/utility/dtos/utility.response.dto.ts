import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class UtilityResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: UtilityResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Sample Utility' })
  readonly name: string
  @ApiProperty({
    default: ['AL', 'AK', 'AZ'],
    type: String,
    isArray: true,
  })
  readonly stateAbbreviations: string[]
  @ApiProperty({ default: 'Blah - Blah' })
  readonly notes: string
}
