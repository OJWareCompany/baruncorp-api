import { NotFoundException } from '@nestjs/common'

export class OrganizationNotFoundException extends NotFoundException {
  constructor() {
    super('Not Organization Found', '20002')
  }
}
