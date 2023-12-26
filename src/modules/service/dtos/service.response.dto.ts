import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { ServicePricingTypeEnum } from '../domain/service.type'
import { StandardPricingRequestDtoFields } from '../commands/create-service/create-service.request.dto'

export class ServiceTaskResponseDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string
}

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

  @ApiProperty({ enum: ServicePricingTypeEnum, default: ServicePricingTypeEnum.standard })
  @IsEnum(ServicePricingTypeEnum)
  pricingType: ServicePricingTypeEnum

  @ApiProperty({ type: StandardPricingRequestDtoFields, default: StandardPricingRequestDtoFields, nullable: true })
  @IsOptional()
  standardPricing: StandardPricingRequestDtoFields | null

  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  fixedPrice: number | null

  @ApiProperty()
  @IsObject()
  relatedTasks: ServiceTaskResponseDto[]

  constructor(props: ServiceResponseDto) {
    initialize(this, props)
  }
}
