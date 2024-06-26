import { BadRequestException, NotFoundException } from '@nestjs/common'

export class InvoiceNotFoundException extends NotFoundException {
  constructor() {
    super('Not Invoice found', '70100')
  }
}

export class NullPriceExistsException extends BadRequestException {
  constructor() {
    super('Null price exists', '70101')
  }
}
export class InvoiceEditException extends BadRequestException {
  constructor() {
    super('Issued Invoice can not be edit.', '70102')
  }
}
