import { NotFoundException } from '@nestjs/common'

export class TaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not task found.', '20300')
  }
}
