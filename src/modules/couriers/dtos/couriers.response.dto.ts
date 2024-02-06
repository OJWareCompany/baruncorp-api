import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class CouriersResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  @IsString()
  readonly id: string

  constructor(props: CouriersResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'USP' })
  name: string
  @ApiProperty({ default: 'https://www.usp.com/track?InqueryNumber1=' })
  urlParam: string
}
