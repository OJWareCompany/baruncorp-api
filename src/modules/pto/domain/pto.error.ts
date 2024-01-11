import { BadRequestException, NotFoundException } from '@nestjs/common'

export class PtoNotFoundException extends NotFoundException {
  constructor() {
    super('Not Pto found', '20801')
  }
}

export class UniqueConstraintException extends BadRequestException {
  constructor(field: string) {
    super(`Unique constraint failed for the field: ${field}`, '20802')
  }
}

export class EndedAtException extends BadRequestException {
  constructor() {
    super(`EndedAt must be a later time than StartedAt.`, '20803')
  }
}

export class PastDatePTOException extends BadRequestException {
  constructor() {
    super(`You cannot register annual leave for past dates.`, '20804')
  }
}

export class TargetUserNotFoundException extends NotFoundException {
  constructor() {
    super(`Target user not founded.`, '20805')
  }
}

export class AnnualPtoNotExceedException extends BadRequestException {
  constructor() {
    super(`Exceeding annual pto limit.`, '20806')
  }
}

export class TotalValueExceedsMaxException extends BadRequestException {
  constructor(currentMaxTotalValue: number) {
    super(`Provided value exceeds the maximum allowed limit of ${currentMaxTotalValue}.`, '20807')
  }
}

export class DaysRangeIssueException extends BadRequestException {
  constructor() {
    super(`PTO cannot be issued by combining days before and after the anniversary of joining the company.`, '20808')
  }
}
