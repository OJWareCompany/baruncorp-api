import { ConflictException, NotFoundException } from '@nestjs/common'

export class CustomPricingNotFoundException extends NotFoundException {
  constructor() {
    super('Not CustomPricing found', '')
  }
}

export class CustomPricingConflictException extends ConflictException {
  constructor() {
    super('CustomPricing is Already Existed', '')
  }
}
