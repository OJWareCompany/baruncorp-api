import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class FindProjectsRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsOptional()
  readonly propertyType?: string

  @ApiProperty({ default: null })
  @IsOptional()
  readonly projectNumber?: string

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsOptional()
  readonly propertyAddress?: string
}
