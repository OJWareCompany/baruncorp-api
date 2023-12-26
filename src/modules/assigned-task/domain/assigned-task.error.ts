import { BadRequestException, NotFoundException } from '@nestjs/common'

export class AssignedTaskNotFoundException extends NotFoundException {
  constructor() {
    super('Not assigned found', '30200')
  }
}

export class AssignedTaskAlreadyCompletedException extends BadRequestException {
  constructor() {
    super('Assigned task is already completed', '30201')
  }
}
