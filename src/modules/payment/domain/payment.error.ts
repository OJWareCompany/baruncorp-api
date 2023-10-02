import { BadRequestException, NotFoundException } from '@nestjs/common'

export class PaymentNotFoundException extends NotFoundException {
  constructor() {
    super('Not Payment found', '')
  }
}

export class PaymentOverException extends BadRequestException {
  constructor() {
    super('Payment Orver', '70200')
  }
}
