import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

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

export class CompletedTaskChangeStatusException extends UnprocessableEntityException {
  constructor() {
    super(`Completed Task Can not be changed Status.`, '30204')
  }
}
export class InprogressTaskAutoChangeStatusException extends UnprocessableEntityException {
  constructor() {
    super(`In Progress Task Can not be Not Started automatically.`, '30205')
  }
}
