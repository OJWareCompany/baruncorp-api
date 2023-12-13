import { ConflictException, NotFoundException } from '@nestjs/common'

export class ExpensePricingNotFoundException extends NotFoundException {
  constructor() {
    super('Not ExpensePricing found', '30301')
  }
}

export class ExpensePricingConflictException extends ConflictException {
  constructor() {
    super('Already ExpensePricing is Existed.', '30302')
  }
}
