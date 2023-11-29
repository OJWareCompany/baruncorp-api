import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

export class UpdateRevisionSizeParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string
}

export class UpdateRevisionSizeRequestDto {
  @ApiProperty({ default: null, enum: OrderedServiceSizeForRevisionEnum })
  @IsEnum(OrderedServiceSizeForRevisionEnum)
  @IsOptional()
  readonly sizeForRevision: OrderedServiceSizeForRevisionEnum | null
}
