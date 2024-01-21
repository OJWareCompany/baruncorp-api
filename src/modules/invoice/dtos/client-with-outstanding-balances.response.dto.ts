import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class ClientWithOutstandingBalancesResponseDto {
  @ApiProperty()
  @IsString()
  readonly organizationId: string

  @ApiProperty()
  @IsString()
  readonly organizationName: string

  @ApiProperty()
  @IsNumber()
  readonly totalBalanceDue: number

  constructor(props: ClientWithOutstandingBalancesResponseDto) {
    initialize(this, props)
  }
}
