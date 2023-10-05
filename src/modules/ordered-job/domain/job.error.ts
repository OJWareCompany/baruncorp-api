import { BadRequestException, NotFoundException } from '@nestjs/common'

export class JobNotFoundException extends NotFoundException {
  constructor() {
    super('Not Ordered Job Found.', '40005')
  }
}

export class NumberOfWetStampBadRequestException extends BadRequestException {
  constructor() {
    super('Maximum number of wet stamp is 255', '40004')
  }
}

export class SystemSizeBadRequestException extends BadRequestException {
  constructor() {
    super('Maximum System size is 99999999', '40007')
  }
}

export class JobCompletedUpdateException extends BadRequestException {
  constructor() {
    super("Job Completed Can't Update", '40006')
  }
}
export class JobIncludingCompletedTaskDeleteException extends BadRequestException {
  constructor() {
    super('Job including completed task can`t be deleted.', '40001')
  }
}
