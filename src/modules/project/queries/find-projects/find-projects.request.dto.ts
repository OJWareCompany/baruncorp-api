import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindProjectsRequestDto {
  @ApiProperty({ default: 'Residential' })
  @IsString()
  @IsOptional()
  readonly propertyType?: string | null

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  readonly projectNumber?: string | null

  @ApiProperty({ default: '3480 Northwest 33rd Court' })
  @IsString()
  @IsOptional()
  readonly propertyAddress?: string | null

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly clientId?: string | null
}
