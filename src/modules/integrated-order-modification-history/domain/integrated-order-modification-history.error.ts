import { NotFoundException } from '@nestjs/common'

export class IntegratedOrderModificationHistoryNotFoundException extends NotFoundException {
  constructor() {
    super('Not IntegratedOrderModificationHistory found', '')
  }
}
