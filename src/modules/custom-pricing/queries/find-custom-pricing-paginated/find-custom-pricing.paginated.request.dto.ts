import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindCustomPricingPaginatedRequestDto {
  @ApiProperty({ default: 'asda' })
  @IsString()
  @IsOptional()
  readonly organizationId?: string | null

  @ApiProperty({ default: 'Barun Corp' })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly serviceId?: string | null

  @ApiProperty({ default: '' })
  @IsString()
  @IsOptional()
  readonly serviceName?: string | null
}
