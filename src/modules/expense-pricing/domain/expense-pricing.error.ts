import { NotFoundException } from '@nestjs/common'

export class ExpensePricingNotFoundException extends NotFoundException {
  constructor() {
    super('Not ExpensePricing found', '30301')
  }
}
