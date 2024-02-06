import { BadRequestException, NotFoundException } from '@nestjs/common'

export class CouriersNotFoundException extends NotFoundException {
  constructor() {
    super('Not Couriers found', '21201')
  }
}

export class UniqueCouriersException extends NotFoundException {
  constructor() {
    super(`Name field must be unique`, '20811')
  }
}
