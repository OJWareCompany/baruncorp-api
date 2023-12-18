import { ApiProperty } from '@nestjs/swagger'
import { IsString, ValidateNested } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { PositionPaginatedResponseFields } from './position.paginated.response.dto'

export class Worker {
  @ApiProperty()
  @IsString()
  readonly userId: string

  @ApiProperty()
  @IsString()
  readonly userName: string

  @ApiProperty()
  @IsString()
  readonly email: string
}

export class PositionResponseDto extends PositionPaginatedResponseFields {
  @ApiProperty()
  @ValidateNested()
  readonly workers: Worker[]

  constructor(props: PositionResponseDto) {
    super(props)
    initialize(this, props)
  }
}
