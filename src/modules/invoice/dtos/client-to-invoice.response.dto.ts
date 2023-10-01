import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class ClientToInvoice {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  date: string[]
}

export class ClientToInvoiceResponseDto {
  @ApiProperty()
  clientToInvoices: ClientToInvoice[]

  constructor(props: ClientToInvoiceResponseDto) {
    initialize(this, props)
  }
}
