import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ServicePricingTypeEnum } from '../../domain/service.type'
import { StandardPricingRequestDtoFields } from '../create-service/create-service.request.dto'

export class UpdateServiceRequestDtoParam {
  @ApiProperty()
  @IsString()
  readonly serviceId: string
}

export class UpdateServiceRequestDto {
  @ApiProperty({ default: 'PV Design' })
  @IsString()
  readonly name: string

  @ApiProperty({ default: '' })
  @IsString()
  readonly billingCode: string

  @ApiProperty({ enum: ServicePricingTypeEnum, default: ServicePricingTypeEnum.standard })
  @IsEnum(ServicePricingTypeEnum)
  readonly type: ServicePricingTypeEnum

  @ApiProperty({ type: StandardPricingRequestDtoFields, default: StandardPricingRequestDtoFields, nullable: true })
  @IsOptional()
  readonly standardPricing: StandardPricingRequestDtoFields | null

  @ApiProperty({ default: null })
  @IsNumber()
  @IsOptional()
  readonly fixedPrice: number | null
}
