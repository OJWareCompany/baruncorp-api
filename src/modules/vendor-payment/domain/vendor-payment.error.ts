import { BadRequestException, NotFoundException } from '@nestjs/common'

export class VendorPaymentNotFoundException extends NotFoundException {
  constructor() {
    super('Not Payment found', '70301')
  }
}

export class VendorPaymentOverException extends BadRequestException {
  constructor(exceededAmount: number) {
    super(`Payment Over, Exceeded ${exceededAmount}.`, '70200')
  }
}

export class UnissuedInvoicePayException extends BadRequestException {
  constructor() {
    super('Unissued can not be paid', '70302')
  }
}
export class ZeroPaymentException extends BadRequestException {
  constructor() {
    super('Zero pay Exception', '70303')
  }
}
