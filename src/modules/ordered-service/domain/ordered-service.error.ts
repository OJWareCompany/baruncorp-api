import { BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

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
    super(`Cannot complete the scope as all tasks are not yet finished.`, '40309')
  }
}

export class OrderedServiceHoldableException extends UnprocessableEntityException {
  constructor() {
    super(`Cannot update to 'On Hold' status: Invalid current status.`, '40310')
  }
}

export class OrderedServiceAutoStartableException extends UnprocessableEntityException {
  constructor() {
    super(`Cannot update to 'Not Started' status: Invalid current status.`, '40311')
  }
}

export class OrderedServiceAutoCancelableException extends UnprocessableEntityException {
  constructor() {
    super(`Cannot update to 'Canceled' status: Invalid current status.`, '40312')
  }
}

export class OrderedScopeIncludingCompletedTaskDeleteException extends UnprocessableEntityException {
  constructor() {
    super('Ordered Scope including completed task can`t be deleted.', '40313')
  }
}

export class OrderedScopeConflictException extends ConflictException {
  constructor() {
    super(
      'Within a single job, the same type of scope cannot be duplicated orders (excluding other type scope).',
      '40314',
    )
  }
}

export class OrderedServicePendingException extends UnprocessableEntityException {
  constructor() {
    super('There are pending tasks, please try again.', '40315')
  }
}
