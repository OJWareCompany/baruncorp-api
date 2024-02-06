import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindAssignedTaskSummaryInProgressPaginatedRequestDto {
  @ApiProperty({ default: 'Barun Corp', required: false })
  @IsString()
  @IsOptional()
  readonly organizationName?: string

  @ApiProperty({ default: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  readonly userName?: string
}
