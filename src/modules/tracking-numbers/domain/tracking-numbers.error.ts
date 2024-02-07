import { BadRequestException, NotFoundException } from '@nestjs/common'

export class TrackingNumbersNotFoundException extends NotFoundException {
  constructor() {
    super('Not Tracking Number found', '21301')
  }
}

export class TooLongTrackingNumberException extends NotFoundException {
  constructor() {
    super('The tracking number is too long. Please within 50 characters', '21302')
  }
}

export class AlreadyExistException extends NotFoundException {
  constructor() {
    super(`Already exists same data.`, '21303')
  }
}
