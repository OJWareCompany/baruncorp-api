import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class FindAssignedTaskSummaryDonePaginatedRequestDto {
  @ApiProperty({ default: 'Barun Corp', required: false })
  @IsString()
  @IsOptional()
  readonly organizationName?: string

  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string

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
