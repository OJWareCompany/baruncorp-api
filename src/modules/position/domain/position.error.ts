import { NotFoundException } from '@nestjs/common'

export class PositionNotFoundException extends NotFoundException {
  constructor() {
    super('Not Position found', '')
  }
}
