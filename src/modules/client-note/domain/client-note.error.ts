import { BadRequestException, NotFoundException } from '@nestjs/common'

export class ClientNoteNotFoundException extends NotFoundException {
  constructor() {
    super('Not client note found', '21001')
  }
}

export class ClientNoteUniqueException extends BadRequestException {
  constructor() {
    super('Each Organization can create one ClientNote', '21002')
  }
}
