import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindJobPaginatedRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsOptional()
  readonly propertyType?: string

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsOptional()
  readonly jobName?: string

  @ApiProperty({ default: '' })
  @IsOptional()
  readonly projectId?: string
}
