import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class InformationResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string
  constructor(props: InformationResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({
    default: 'string contents...',
  })
  contents: string
  @ApiProperty({ default: true })
  isActive: boolean
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  createdAt: Date
  @ApiProperty({ default: '2024-01-07T23:56:28.493Z' })
  updatedAt: Date
}
