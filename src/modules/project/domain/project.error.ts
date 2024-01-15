import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class ProjectNotFoundException extends NotFoundException {
  constructor() {
    super('Not Project Found.', '30001')
  }
}

export class ProjectPropertyAddressConflictException extends ConflictException {
  constructor() {
    super('Project Property Full Address is Already Existed.', '30002')
  }
}

export class ProjectNumberConflictException extends ConflictException {
  constructor() {
    super('Project number is Already Existed.', '30003')
  }
}

export class CoordinatesNotFoundException extends NotFoundException {
  constructor() {
    super('Wrong coordinates.', '30004')
  }
}

export class ProjectIncludingJobDeleteException extends BadRequestException {
  constructor() {
    super('This project is including jobs.', '40000')
  }
}
