import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { TaskResponseDto } from '../../task/dtos/task.response.dto'
import { ServicePricingTypeEnum } from '../domain/service.type'
import { StandardPricingRequestDtoFields } from '../commands/create-service/create-service.request.dto'

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
  relatedTasks: TaskResponseDto[]

  constructor(props: ServiceResponseDto) {
    initialize(this, props)
  }
}
