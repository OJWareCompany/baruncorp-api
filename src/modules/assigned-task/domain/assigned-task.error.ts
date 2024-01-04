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

export class AssigneeNotFoundException extends NotFoundException {
  constructor() {
    super('Not assignee found', '30202')
  }
}

export class AssignedTaskDurationExceededException extends BadRequestException {
  constructor() {
    super('The duration of the task is too long. Please enter a value less than or equal to 127.', '30203')
  }
}
