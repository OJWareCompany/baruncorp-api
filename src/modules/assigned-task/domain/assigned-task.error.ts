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

export class CompletedTaskDeletionException extends UnprocessableEntityException {
  constructor() {
    super('Completed task is not able to be deleted', '30206')
  }
}

export class AssignedTaskPendingException extends UnprocessableEntityException {
  constructor() {
    super('There are pending tasks for setting the assignee of this task, please try again.', '30207')
  }
}

export class AssignedTaskBackToNotStartedException extends UnprocessableEntityException {
  constructor() {
    super('Tasks assigned to a person cannot be modified to the Not Started status.', '30208')
  }
}

export class UnassignedTaskProgressException extends UnprocessableEntityException {
  constructor() {
    super('Tasks without an assigned person cannot be modified to the In Progress status.', '30209')
  }
}
