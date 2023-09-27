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
