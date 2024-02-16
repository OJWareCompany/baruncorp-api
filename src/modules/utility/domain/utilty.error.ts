import { BadRequestException, NotFoundException } from '@nestjs/common'

export class UtilityNotFoundException extends NotFoundException {
  constructor() {
    super('Not utility found', '21501')
  }
}

export class UtilityNameLengthException extends NotFoundException {
  constructor() {
    super('The Name field must be at least 2 characters', '21502')
  }
}

export class UniqueUtilitiesException extends NotFoundException {
  constructor() {
    super(`Name field must be unique`, '21503')
  }
}
