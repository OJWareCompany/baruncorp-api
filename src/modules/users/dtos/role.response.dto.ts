import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class RoleResponseDto {
  @ApiProperty()
  name: string
  constructor(props: RoleResponseDto) {
    initialize(this, props)
  }
}
