import { BadRequestException, NotFoundException } from '@nestjs/common'

export class CouriersNotFoundException extends NotFoundException {
  constructor() {
    super('Not Couriers found', '21201')
  }
}
