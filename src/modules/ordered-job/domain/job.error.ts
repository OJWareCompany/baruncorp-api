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
