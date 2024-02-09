import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class FindAssignedTaskSummaryTotalPaginatedRequestDto {
  @ApiProperty({ default: '2024-01-05', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly startedAt?: Date

  @ApiProperty({ default: '2025-01-06', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endedAt?: Date
}
