import { BadRequestException, NotFoundException } from '@nestjs/common'

export class JobNoteNotFoundException extends NotFoundException {
  constructor() {
    super('Job Note not found', '21101')
  }
}

export class ReceiverEmailsFoundException extends BadRequestException {
  constructor() {
    super('Receiver Emails not found', '21102')
  }
}
