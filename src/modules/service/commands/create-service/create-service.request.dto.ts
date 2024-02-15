import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { CustomMax } from '../../../../libs/decorators/custom/custom-max.decorator'
import { ServiceDurationExceededException } from '../../domain/service.error'
import { ServicePricingTypeEnum } from '../../domain/service.type'

export class CommercialTier {
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

export class StandardPricingRequestDtoFields {
  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  residentialPrice: number | null

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  residentialGmPrice: number | null

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  residentialRevisionPrice: number | null

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  residentialRevisionGmPrice: number | null

  @ApiProperty({
    default: [{ startingPoint: 0.01, finishingPoint: 100, price: 10 }],
    type: CommercialTier,
    isArray: true,
  })
  @IsArray()
  commercialNewServiceTiers: CommercialTier[]

  @ApiProperty({ default: 0.167 })
  @IsNumber()
  @IsOptional()
  commercialRevisionCostPerUnit: number | null

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  commercialRevisionMinutesPerUnit: number | null
}

export class CreateServiceRequestDto {
  @ApiProperty({ default: 'PV Design' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly billingCode: string

  @ApiProperty({ enum: ServicePricingTypeEnum, default: ServicePricingTypeEnum.standard })
  @IsEnum(ServicePricingTypeEnum)
  readonly pricingType: ServicePricingTypeEnum

  @ApiProperty({ type: StandardPricingRequestDtoFields, default: StandardPricingRequestDtoFields, nullable: true })
  @IsOptional()
  readonly standardPricing: StandardPricingRequestDtoFields | null

  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  readonly fixedPrice: number | null

  @ApiProperty({ default: null, maximum: ServiceDurationExceededException.value })
  @IsNumber()
  @CustomMax(ServiceDurationExceededException.value, new ServiceDurationExceededException())
  @IsOptional()
  readonly residentialNewEstimatedTaskDuration: number | null

  @ApiProperty({ default: null, maximum: ServiceDurationExceededException.value })
  @IsNumber()
  @CustomMax(ServiceDurationExceededException.value, new ServiceDurationExceededException())
  @IsOptional()
  readonly residentialRevisionEstimatedTaskDuration: number | null

  @ApiProperty({ default: null, maximum: ServiceDurationExceededException.value })
  @IsNumber()
  @CustomMax(ServiceDurationExceededException.value, new ServiceDurationExceededException())
  @IsOptional()
  readonly commercialNewEstimatedTaskDuration: number | null

  @ApiProperty({ default: null, maximum: ServiceDurationExceededException.value })
  @IsNumber()
  @CustomMax(ServiceDurationExceededException.value, new ServiceDurationExceededException())
  @IsOptional()
  readonly commercialRevisionEstimatedTaskDuration: number | null
}
