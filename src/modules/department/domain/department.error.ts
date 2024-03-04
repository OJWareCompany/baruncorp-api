import { ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

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

export class DepartmentManagementJoiningException extends UnprocessableEntityException {
  constructor() {
    super('Management department is for only baruncorp member.', '20403')
  }
}

export class DepartmentAlreadyJoinException extends UnprocessableEntityException {
  constructor() {
    super('User already belongs to department.  ', '20404')
  }
}
