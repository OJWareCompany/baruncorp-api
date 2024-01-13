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

export class PastDatePtoException extends BadRequestException {
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
    super(`Pto cannot be issued by combining days before and after the anniversary of joining the company.`, '20808')
  }
}

export class PaidPTODeleteException extends BadRequestException {
  constructor() {
    super(`Paid pto cannot be deleted`, '20809')
  }
}

export class PaidPTOUpdateException extends BadRequestException {
  constructor() {
    super(`Paid pto cannot be updated`, '20810')
  }
}

export class UniqueTenureException extends BadRequestException {
  constructor() {
    super(`Tenure is unique`, '20811')
  }
}

export class DateOfJoiningNotFoundException extends NotFoundException {
  constructor() {
    super(`Target user must have date of joining.`, '20812')
  }
}

export class OverlapsPtoException extends BadRequestException {
  constructor() {
    super(`Overlaps with the existing PTO dates.`, '20813')
  }
}
