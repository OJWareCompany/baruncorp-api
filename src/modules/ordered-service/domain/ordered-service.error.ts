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
