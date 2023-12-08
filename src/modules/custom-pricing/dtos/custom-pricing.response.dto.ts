import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import {
  CustomPricingTypeEnum,
  ResidentialNewServicePricingTypeEnum,
} from '../commands/create-custom-pricing/create-custom-pricing.command'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class Tier {
  @ApiProperty({ default: 0.01 })
  @IsNumber()
  startingPoint: number

  @ApiProperty({ default: 100 })
  @IsNumber()
  finishingPoint: number | null

  @ApiProperty({ default: 10 })
  @IsNumber()
  price: number

  @ApiProperty({ default: 10 })
  @IsNumber()
  gmPrice: number
}

export class CustomPricingResponseDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly customPricingId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ enum: CustomPricingTypeEnum, default: CustomPricingTypeEnum.custom_standard })
  @IsEnum(CustomPricingTypeEnum)
  readonly customPricingType: CustomPricingTypeEnum

  @ApiProperty({
    enum: ResidentialNewServicePricingTypeEnum,
    default: ResidentialNewServicePricingTypeEnum.tiered,
  })
  @IsEnum(ResidentialNewServicePricingTypeEnum)
  @IsOptional()
  readonly residentialNewServicePricingType: ResidentialNewServicePricingTypeEnum | null

  @ApiProperty({ default: null })
  @IsOptional()
  readonly residentialNewServiceFlatPrice: number | null

  @ApiProperty({ default: null })
  @IsOptional()
  readonly residentialNewServiceFlatGmPrice: number | null

  @ApiProperty({
    default: [
      { startingPoint: 1, finishingPoint: 100, price: 10, gmPrice: 12.01 },
      { startingPoint: 101, finishingPoint: 200, price: 10, gmPrice: 12.01 },
      { startingPoint: 201, finishingPoint: null, price: 10, gmPrice: 12.01 },
    ],
    type: Tier,
    isArray: true,
  })
  @IsArray()
  readonly residentialNewServiceTiers: Tier[]

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  readonly residentialRevisionPrice: number | null

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  readonly residentialRevisionGmPrice: number | null

  @ApiProperty({
    default: [
      { startingPoint: 0.01, finishingPoint: 100, price: 10, gmPrice: 12.01 },
      { startingPoint: 100.01, finishingPoint: 200, price: 10, gmPrice: 12.01 },
      { startingPoint: 200.01, finishingPoint: null, price: 10, gmPrice: 12.01 },
    ],
    type: Tier,
    isArray: true,
  })
  @IsArray()
  readonly commercialNewServiceTiers: Tier[]

  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  readonly fixedPrice: number | null

  constructor(props: CustomPricingResponseDto) {
    initialize(this, props)
  }
}
