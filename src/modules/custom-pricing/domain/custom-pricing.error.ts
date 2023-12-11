import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class CustomPricingNotFoundException extends NotFoundException {
  constructor() {
    super('Not CustomPricing found', '30100')
  }
}

export class CustomPricingConflictException extends ConflictException {
  constructor() {
    super('CustomPricing is Already Existed', '30101')
  }
}

export class CustomPricingInvalidPriceException extends BadRequestException {
  constructor() {
    super('invalid price exception.', '30102')
  }
}
