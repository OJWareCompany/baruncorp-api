import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'

export class OrganizationNotFoundException extends NotFoundException {
  constructor() {
    super('Not Organization Found', '20002')
  }
}

export class OrganizationConflictException extends ConflictException {
  constructor(name: string) {
    super(`${name} is already existed.`, '20001')
  }
}

export class WrongClientException extends BadRequestException {
  constructor() {
    super(`Wrong client`, '20003')
  }
}
