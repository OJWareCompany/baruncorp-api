import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { CustomPricingType } from './create-custom-pricing.command'

export class Tier {
  @ApiProperty({ default: 0.01 })
  @IsNumber()
  startingPoint: number

  @ApiProperty({ default: 100 })
  @IsNumber()
  finishingPoint: number

  @ApiProperty({ default: 10 })
  @IsNumber()
  price: number

  @ApiProperty({ default: 10 })
  @IsNumber()
  gmPrice: number
}

export class CreateCustomPricingRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly serviceId: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly organizationId: string

  @ApiProperty({ enum: CustomPricingType, default: CustomPricingType.custom_standard })
  @IsEnum(CustomPricingType)
  readonly customPricingType: CustomPricingType

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
}
