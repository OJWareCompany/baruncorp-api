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
    super('Name Already Existed', '20203')
  }
}

export class PositionTaskConflictException extends ConflictException {
  constructor() {
    super('Position Task Conflict', '20204')
  }
}

export class PositionTaskNotFoundException extends NotFoundException {
  constructor() {
    super('Position Task Not Found', '20205')
  }
}

export class PositionWorkerConflictException extends ConflictException {
  constructor() {
    super('Position Worker Conflict', '20206')
  }
}

export class PositionWorkerNotFoundException extends NotFoundException {
  constructor() {
    super('Position Worker Not Found', '20207')
  }
}
