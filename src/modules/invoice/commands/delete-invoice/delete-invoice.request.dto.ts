import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteInvoiceParamRequestDto {
  @ApiProperty({ default: '' })
  @IsString()
  readonly invoiceId: string
}
