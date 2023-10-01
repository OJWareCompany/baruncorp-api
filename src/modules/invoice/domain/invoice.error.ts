import { NotFoundException } from '@nestjs/common'

export class InvoiceNotFoundException extends NotFoundException {
  constructor() {
    super('Not Invoice found', '')
  }
}
