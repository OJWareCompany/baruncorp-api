import { NotFoundException } from '@nestjs/common'

export class AssignedTaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not assigned found', '30200')
  }
}
