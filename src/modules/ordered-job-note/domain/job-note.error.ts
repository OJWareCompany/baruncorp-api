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

export class EmailSendFailedException extends BadRequestException {
  constructor() {
    super('Failed to send email. Please check the email address', '21103')
  }
}
