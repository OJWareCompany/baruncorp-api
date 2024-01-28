import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

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

export class IssuedJobUpdateException extends BadRequestException {
  constructor() {
    super('Job can not be updated after invoice is issued.', '40002')
  }
}

export class JobIsNotCompletedUpdateException extends BadRequestException {
  constructor() {
    super('Deliverables cannot be sent if the job is incomplete.', '40008')
  }
}

export class JobMissingDeliverablesEmailException extends UnprocessableEntityException {
  constructor() {
    super('Missing deliverables email address in the request. Please provide a valid email.', '40009')
  }
}

export class JobCompleteException extends UnprocessableEntityException {
  constructor() {
    super('If there are unfinished services, the job cannot be completed.', '40010')
  }
}

export class JobNotStartableException extends UnprocessableEntityException {
  constructor() {
    super(`Cannot change job status to 'Not Started'.`, '40011')
  }
}

export class JobSendableToClientPriceNotSetException extends UnprocessableEntityException {
  constructor() {
    super(`Job cannot be sent to client as the price is not set.`, '40012')
  }
}

export class JobSendableToClientScopesInCompletedException extends UnprocessableEntityException {
  constructor() {
    super(`Job cannot be sent to client as there are incomplete scopes.`, '40013')
  }
}

export class NoUpdateException extends BadRequestException {
  constructor() {
    super('To update, different data from the existing ones must be entered', '40014')
  }
}
