import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

/**
 * Remove interface after select fields
 */
export class CreditOrganizationTransactionResponseDto {
  @ApiProperty()
  @IsString()
  readonly clientOrganizationId: string

  @ApiProperty()
  @IsNumber()
  readonly creditAmount: number

  constructor(props: CreditOrganizationTransactionResponseDto) {
    initialize(this, props)
  }
}
