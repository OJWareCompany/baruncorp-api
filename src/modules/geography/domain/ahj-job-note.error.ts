import { NotFoundException } from '@nestjs/common'

export class AhjJobNoteNotFoundException extends NotFoundException {
  constructor() {
    super('Not ahj job note found.', '50001')
  }
}

export class AhjJobNoteHistoryNotFoundException extends NotFoundException {
  constructor() {
    super('Not ahj job note found.', '50002')
  }
}
