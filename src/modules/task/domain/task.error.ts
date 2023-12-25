import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class TaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not task found.', '20300')
  }
}

export class PreTaskConflictException extends ConflictException {
  constructor() {
    super('pre task conflict.', '20301')
  }
}

export class PreTaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not pre task found.', '20302')
  }
}
