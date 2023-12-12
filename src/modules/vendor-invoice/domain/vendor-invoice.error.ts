import { NotFoundException } from '@nestjs/common'

export class VendorInvoiceNotFoundException extends NotFoundException {
  constructor() {
    super('Not VendorInvoice found', '')
  }
}
