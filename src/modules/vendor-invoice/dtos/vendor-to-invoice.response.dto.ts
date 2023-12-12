import { ApiProperty } from '@nestjs/swagger'
import { initialize } from '../../../libs/utils/constructor-initializer'

export class VendorToInvoice {
  @ApiProperty()
  organizationId: string

  @ApiProperty()
  organizationName: string

  @ApiProperty()
  dates: string[]
}

export class VendorToInvoiceResponseDto {
  @ApiProperty()
  vendorsToInvoice: VendorToInvoice[]

  constructor(props: VendorToInvoiceResponseDto) {
    initialize(this, props)
  }
}
