import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class ServiceResponseDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  billingCode: string

  @ApiProperty()
  @IsNumber()
  basePrice: number

  constructor(props: ServiceResponseDto) {
    initialize(this, props)
  }
}
