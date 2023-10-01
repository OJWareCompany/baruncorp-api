import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindInvoicePaginatedRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}
