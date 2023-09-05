import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindJobPaginatedRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsOptional()
  readonly propertyType?: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsOptional()
  readonly jobName?: string | null

  @ApiProperty({ default: '' })
  @IsOptional()
  readonly projectId?: string | null
}
