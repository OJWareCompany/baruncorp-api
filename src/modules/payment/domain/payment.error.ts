import { BadRequestException, NotFoundException } from '@nestjs/common'

export class PaymentNotFoundException extends NotFoundException {
  constructor() {
    super('Not Payment found', '70201')
  }
}

export class PaymentOverException extends BadRequestException {
  constructor() {
    super('Payment Over', '70200')
  }
}

export class UnissuedInvoicePayException extends BadRequestException {
  constructor() {
    super('Unissued can not be paid', '70202')
  }
}
export class ZeroPaymentException extends BadRequestException {
  constructor() {
    super('Zero pay Exception', '70203')
  }
}
