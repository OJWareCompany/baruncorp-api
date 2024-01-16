import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class PtoTypeAvailableValue {
  constructor(props: PtoTypeAvailableValue) {
    initialize(this, props)
  }
  @ApiProperty({ default: '1' })
  value: number
}

export class PtoTypeResponseDto {
  @ApiProperty({ default: 'bd2d7904-136d-4e2e-966a-679fe4f499d0' })
  id: string
  constructor(props: PtoTypeResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'Vacation' })
  name: string
  @ApiProperty({ default: [] })
  availableValues: PtoTypeAvailableValue[]
}
