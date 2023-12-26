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

export class AvailableTaskAddNoLicenseException extends BadRequestException {
  constructor() {
    super('This task can only be added through license registration.', '20303')
  }
}

export class AvailableTaskDeleteNoLicenseException extends BadRequestException {
  constructor() {
    super('This task can only be deleted through license registration.', '20304')
  }
}

export class AvailableTaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not available task found.', '20305')
  }
}

export class TaskPositionInvalidException extends BadRequestException {
  constructor() {
    super('The array to be sorted includes a position that is not part of the task.', '20306')
  }
}
