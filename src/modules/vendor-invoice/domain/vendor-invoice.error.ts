import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export class VendorInvoiceNotFoundException extends NotFoundException {
  constructor() {
    super('Not VendorInvoice found', '50501')
  }
}

export class VendorInvoiceInvalidTotalUpdateException extends UnprocessableEntityException {
  constructor() {
    super(`The total cannot be modified to an amount less than the currently registered payment.`, '50502')
  }
}
