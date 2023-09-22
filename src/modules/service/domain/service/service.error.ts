import { ConflictException } from '@nestjs/common'

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
