import { NotFoundException } from '@nestjs/common'

export class NotFoundOrganization extends NotFoundException {
  constructor() {
    super('Not Organization Found', '20002')
  }
}
