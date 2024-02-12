import { BadRequestException, NotFoundException } from '@nestjs/common'

export class ScheduleNotFoundException extends NotFoundException {
  constructor() {
    super('Not schedule found', '21401')
  }
}

export class ScheduleTimeFormatException extends NotFoundException {
  constructor() {
    super('Must be a valid time format (HH:mm:ss)', '21402')
  }
}

export class EndLaterThanStartException extends NotFoundException {
  constructor() {
    super('The end field must be later than the start field', '21403')
  }
}

export class DuplicateScheduleException extends NotFoundException {
  constructor() {
    super('Duplicate schedules are not allowed', '21404')
  }
}
