import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class ServiceNameConflictException extends ConflictException {
  constructor() {
    super('This service name is already existed.', '40100')
  }
}

export class ServiceBillingCodeConflictException extends ConflictException {
  constructor() {
    super('This service billing code is already existed.', '40101')
  }
}
export class ServiceNotFoundException extends NotFoundException {
  constructor() {
    super('Service is not found.', '40102')
  }
}
export class ServiceBillingCodeUpdateException extends BadRequestException {
  constructor() {
    super('The billing code of a service with associated tasks cannot be modified.', '40103')
  }
}

export class ServiceNameUpdateException extends BadRequestException {
  constructor() {
    super('The name of a service with associated tasks cannot be modified.', '40104')
  }
}
