import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindVendorCreditTransactionPaginatedRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly vendorOrganizationId?: string | null
}
