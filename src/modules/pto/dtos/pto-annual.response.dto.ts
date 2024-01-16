import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class PtoTypeInfo {
  constructor(props: PtoTypeInfo) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'ad2d7904-136d-4e2e-966a-679fe4f499d2' })
  ptoTypeId: string
  @ApiProperty({ default: 'Vacation' })
  ptoTypeName: string
  @ApiProperty({ default: 10 })
  totalAmount: number
}

export class PtoAnnualResponseDto {
  constructor(props: PtoAnnualResponseDto) {
    initialize(this, props)
  }
  @ApiProperty({ default: 'ad2d7904-136d-4e2e-966a-679fe4f499d2' })
  userId: string
  @ApiProperty({ default: 'Deo' })
  userFirstName: string
  @ApiProperty({ default: 'John' })
  userLastName: string
  @ApiProperty({ default: [] })
  ptoTypeInfos: PtoTypeInfo[]
  @ApiProperty({ default: 10 })
  totalAmount: number
}
