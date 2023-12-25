import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class PositionNotFoundException extends NotFoundException {
  constructor() {
    super('Not Position found', '20201')
  }
}

export class MaximumInvalidException extends BadRequestException {
  constructor() {
    super('Maximum is 255', '20202')
  }
}

export class PositionNameConflictException extends ConflictException {
  constructor() {
    super('Name Already Existed', '20202')
  }
}
