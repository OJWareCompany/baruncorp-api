import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindJobPaginatedRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsString()
  @IsOptional()
  readonly propertyType: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  @IsOptional()
  readonly jobName: string | null

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly projectId: string | null
}
