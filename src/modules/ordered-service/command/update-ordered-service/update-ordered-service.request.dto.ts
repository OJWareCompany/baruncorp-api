import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { OrderedServiceSizeForRevisionEnum } from '../../domain/ordered-service.type'

export class UpdateOrderedServiceParamRequestDto {
  @ApiProperty()
  @IsString()
  readonly orderedServiceId: string
}

export class UpdateOrderedServiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly description: string | null
}
