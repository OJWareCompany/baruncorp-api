import { BadRequestException, NotFoundException } from '@nestjs/common'

export class PtoNotFoundException extends NotFoundException {
  constructor() {
    super('Not PtoTenurePolicy found', '20801')
  }
}

export class UniqueConstraintException extends BadRequestException {
  constructor(field: string) {
    super(`Unique constraint failed for the field: ${field}`, '20802')
  }
}
