import { NotFoundException } from '@nestjs/common'

export class PaymentNotFoundException extends NotFoundException {
  constructor() {
    super('Not Payment found', '')
  }
}
