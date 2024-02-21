import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

/**
 * Remove interface after select fields
 */
export class VendorCreditOrganizationTransactionResponseDto {
  @ApiProperty()
  @IsString()
  readonly vendorOrganizationId: string

  @ApiProperty()
  @IsNumber()
  readonly creditAmount: number

  constructor(props: VendorCreditOrganizationTransactionResponseDto) {
    initialize(this, props)
  }
}
