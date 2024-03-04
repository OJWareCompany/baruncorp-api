import { ConflictException, NotFoundException } from '@nestjs/common'

export class DepartmentNotFoundException extends NotFoundException {
  constructor() {
    super('Not Department found', '20401')
  }
}

export class DepartmentNameConflictException extends ConflictException {
  constructor() {
    super('Department Name Conflict.', '20402')
  }
}
