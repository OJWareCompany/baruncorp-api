import { BadRequestException, NotFoundException } from '@nestjs/common'

export class UtilityNotFoundException extends NotFoundException {
  constructor() {
    super('Not utility found', '21501')
  }
}
