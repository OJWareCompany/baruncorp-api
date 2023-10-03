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
