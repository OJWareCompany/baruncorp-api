import { NotFoundException } from '@nestjs/common'

export class StateNotFoundException extends NotFoundException {
  constructor() {
    super('Not State Found', '20501')
  }
}
