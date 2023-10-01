import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FindInvoiceRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}
