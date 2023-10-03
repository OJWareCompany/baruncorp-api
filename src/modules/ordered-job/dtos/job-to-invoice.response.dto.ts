import { ApiProperty } from '@nestjs/swagger'
import { LineItem } from '../../invoice/dtos/invoice.response.dto'

export class JobToInvoiceResponseDto {
  @ApiProperty({ type: LineItem, isArray: true })
  readonly items: LineItem[]

  @ApiProperty()
  subtotal: number

  @ApiProperty()
  discount: number

  @ApiProperty()
  total: number
}
