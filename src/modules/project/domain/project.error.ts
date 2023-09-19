import { ConflictException, NotFoundException } from '@nestjs/common'

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('Not Project Found.', '30001')
  }
}

export class ProjectPropertyAddressConflicException extends ConflictException {
  constructor() {
    super('Project Property Full Address is Already Existed.', '30002')
  }
}

export class ProjectNumberConflicException extends ConflictException {
  constructor() {
    super('Project number is Already Existed.', '30003')
  }
}
