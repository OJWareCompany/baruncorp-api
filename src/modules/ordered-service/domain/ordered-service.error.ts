import { BadRequestException, NotFoundException } from '@nestjs/common'

export class OrderedServiceNotFoundException extends NotFoundException {
  constructor() {
    super('Not ordered service found.', '40300')
  }
}

export class OrderedServiceAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('completed service can not be modified status.', '40301')
  }
}

export class OrderedServiceInvalidRevisionSizeForManualPriceUpdateException extends BadRequestException {
  constructor() {
    super('Invalid Revision Size For Update Manual Price. please update state to Major.', '40302')
  }
}

export class OrderedServiceInvalidRevisionStateException extends BadRequestException {
  constructor() {
    super('Invalid Revision State For Update Revision Size.', '40303')
  }
}

export class OrderedServiceCommercialRevisionManualPriceUpdateException extends BadRequestException {
  constructor() {
    super(
      `The manual price for commercial revision is not modifiable, and the price is automatically set when the duration of the task is entered.`,
      '40304',
    )
  }
}
export class OrderedServiceFreeRevisionManualPriceUpdateException extends BadRequestException {
  constructor() {
    super(`Free revisions cannot have a manual price set.`, '40305')
  }
}

export class FixedPricingRevisionUpdateException extends BadRequestException {
  constructor() {
    super(`Revision size update is not allowed for fixed pricing.`, '40306')
  }
}
