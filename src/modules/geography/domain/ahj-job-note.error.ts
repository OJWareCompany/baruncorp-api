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

export class AhjNoteNotFoundException extends NotFoundException {
  constructor() {
    super('Not ahj note found.', '70001')
  }
}

export class AhjNoteHistoryNotFoundException extends NotFoundException {
  constructor() {
    super('Not ahj note found.', '70002')
  }
}

export class StateNotFoundException extends NotFoundException {
  constructor() {
    super('Not state found.', '70003')
  }
}
