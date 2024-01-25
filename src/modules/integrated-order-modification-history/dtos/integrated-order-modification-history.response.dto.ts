import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { initialize } from '../../../libs/utils/constructor-initializer'
import { OrderModificationHistoryOperationEnum } from '../domain/integrated-order-modification-history.type'

/**
 * Remove interface after select fields
 */
export class IntegratedOrderModificationHistoryResponseDto {
  @ApiProperty()
  @IsString()
  jobId: string

  @ApiProperty()
  @IsDate()
  modifiedAt: Date

  @ApiProperty()
  @IsString()
  modifiedBy: string

  @ApiProperty()
  @IsString()
  entity: string

  @ApiProperty()
  @IsString()
  entityId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  scopeOrTaskName: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  attribute: string | null

  @ApiProperty()
  @IsEnum(OrderModificationHistoryOperationEnum)
  operation: OrderModificationHistoryOperationEnum

  @ApiProperty()
  @IsString()
  @IsOptional()
  afterValue: string | null

  @ApiProperty()
  @IsString()
  @IsOptional()
  beforeValue: string | null

  constructor(props: IntegratedOrderModificationHistoryResponseDto) {
    initialize(this, props)
  }
}
