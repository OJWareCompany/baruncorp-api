import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { OrderedServiceStatusEnum } from '../../domain/ordered-service.type'

export class UpdateOrderedScopeStatusParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedScopeId: string
}

export class UpdateOrderedScopeStatusRequestDto {
  @ApiProperty({ enum: OrderedServiceStatusEnum, default: OrderedServiceStatusEnum.In_Progress })
  @IsEnum(OrderedServiceStatusEnum)
  readonly status: OrderedServiceStatusEnum
}
