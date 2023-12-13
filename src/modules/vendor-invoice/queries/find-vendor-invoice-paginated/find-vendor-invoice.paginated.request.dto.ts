import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindVendorInvoicePaginatedRequestDto {
  @ApiProperty({ default: 'BarunCorp' })
  @IsString()
  @IsOptional()
  readonly organizationName?: string | null
}
