import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { AddressProps } from '../../organization/domain/value-objects/address.vo'

export class AddressDto {
  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  readonly street1: string

  @ApiProperty({ default: 'A101', nullable: true })
  @IsString()
  @IsOptional()
  readonly street2: string | null

  @ApiProperty({ default: 'Lauderdale Lakes' })
  @IsString()
  readonly city: string

  @ApiProperty({ default: 'Florida' })
  @IsString()
  readonly state: string

  @ApiProperty({ default: '33309' })
  @IsString()
  readonly postalCode: string

  @ApiProperty({ default: 'United State' })
  @IsString()
  @IsOptional()
  readonly country: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court, Lauderdale Lakes, Florida 33309' })
  @IsString()
  readonly fullAddress: string

  @ApiProperty({ default: [-97.87, 34], type: Number, isArray: true })
  @IsArray()
  readonly coordinates: number[]

  constructor(props: AddressProps) {
    initialize(this, props)
  }
}
