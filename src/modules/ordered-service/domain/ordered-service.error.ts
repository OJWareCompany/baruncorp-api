import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

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

export class OrderedServiceNonResidentialRevisionTypeUpdateException extends BadRequestException {
  constructor() {
    super('Revision type update is only allowed for Residential Service.', '40303')
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
    super(`Revision type update is not allowed for fixed pricing.`, '40306')
  }
}

export class NewServiceRevisionUpdateException extends BadRequestException {
  constructor() {
    super(`Revision type update is not allowed for New Service.`, '40307')
  }
}
export class SpecialRevisionPricingRevisionTypeUpdateException extends BadRequestException {
  constructor() {
    super(`Revision type update is not allowed for Special Revision Pricing.`, '40308')
  }
}

export class OrderedServiceCompletableException extends UnprocessableEntityException {
  constructor() {
    super(`Cannot complete the scope as all tasks are not yet finished.`, '400309')
  }
}
